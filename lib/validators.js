const mongoose = require('mongoose');
const { body } = require('express-validator');
const User = require("../models/user");
const { userRoles } = require('./constants');
const Checklist = require('../models/checklist');
const Order = require('../models/order');
const { ForbiddenError } = require('./errors');

exports.createUserValidator = [
  body('name').notEmpty().withMessage('Name is required').bail().isString(),
  body('role')
    .notEmpty().withMessage("Role is required").bail()
    .toLowerCase()
    .isIn(["admin", "procurement_manager", "inspection_manager", "client"]).withMessage('Invalid role'),
  body('email')
    .if((value, { req }) => req.body.role !== 'INSPECTION_MANAGER')
    .notEmpty().withMessage('Email required').bail()
    .isEmail().withMessage('Invalid email').bail()
    .custom(async (value) => {
      const exists = await User.findOne({ email: value });
      if (exists) throw new Error('Email already in use');
      return true;
    }),
  body('mobile_number')
    .if((value, { req }) => req.body.role === 'INSPECTION_MANAGER')
    .notEmpty().withMessage('Mobile number required').bail()
    .matches(/^[0-9]{10,15}$/).withMessage('Mobile number invalid').bail()
    .custom(async (value) => {
      const exists = await User.findOne({ mobile_number: value });
      if (exists) throw new Error('Mobile number already in use');
      return true;
    }),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 chars').bail()
    .custom((val) => {
      const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!strong.test(val)) throw new Error('Password must include upper, lower and a number');
      return true;
    }),
];


const questionValidations = [
  body('questions.*.question_text')
    .notEmpty().withMessage('Question text is required')
    .isString().withMessage('Question text must be a string'),

  body('questions.*.question_type')
    .default("TEXT")
    .notEmpty().withMessage('Question type is required')
    .isIn(['BOOLEAN', 'DROPDOWN', 'MULTIPLE_CHOICE', 'TEXT', 'IMAGE_UPLOAD'])
    .withMessage('Invalid question type'),

  body('questions.*.options')
    .optional()
    .isArray().withMessage('Options must be an array of strings')
    .custom((options, { req }) => {
      // enforce rules only for DROPDOWN & MULTIPLE_CHOICE
      const type = req.body.questions.find(q => q.options === options)?.question_type;
      if (['DROPDOWN', 'MULTIPLE_CHOICE'].includes(type) && (!options || options.length < 2)) {
        throw new Error('At least 2 options are required for dropdown/multiple choice');
      }
      return true;
    }),

  body('questions.*.is_required')
    .optional()
    .isBoolean().withMessage('is_required must be a boolean'),

  body('questions.*.order_index')
    .optional()
    .isInt({ min: 0 }).withMessage('order_index must be a non-negative integer'),
];

exports.checklistValidations = [
  body('name')
    .notEmpty().withMessage('Checklist name is required').bail()
    .isString().withMessage('Checklist name must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('Invalid status'),

  body('is_default')
    .optional()
    .isBoolean().withMessage('is_default must be a boolean'),

  ...questionValidations,
];

exports.updateChecklistStatusValidators = [
  body('status')
    .notEmpty().withMessage("Status is required").bail()
    .isIn(['peniding', 'in-progress', 'done']).withMessage("Invalid status for checklist")
]

exports.createOrderValidators = [
  body('client')
    .notEmpty().withMessage("Client id is required").bail()
    .custom(async (value, {req}) => {
      const clientUser = await User.findOne({_id: value});
      if (!clientUser || clientUser.role !== userRoles.CLIENT) {
        throw new Error("Invalid client id");
      }
      return true;
    }),
  body('inpection_manger')
    .notEmpty().withMessage("Inspection manager is required").bail()
    .custom(async (value, {req}) => {
      const inspectionManager = await User.findById(value).select({role: 1, _id: 1});
      if (!inspectionManager || inspectionManager.role !== userRoles.INSPECTION_MANAGER) {
        throw new Error("Invalid inspection manager id");
      }
      return true;
    }),
  body('checklist')
  .notEmpty().withMessage("Check list is required").bail()
  .custom(async (value, {req}) => {
      const checklist = await Checklist.findById(value).select({ _id: 1});
      if (!checklist) {
        throw new Error("Invalid checklist id");
      }
      return true;
    }),
  body('status')
  .optional()
  .isIn(['created','in_progress','completed','rejected']).withMessage("Invalid status")
]

exports.updateOrderStatusValidators = [
  body('status')
    .notEmpty().withMessage("Status is required")
]

exports.answersValidations = [
  body("order_id")
    .notEmpty()
    .withMessage("order_id is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid order_id");
      }
      return true;
    }),

  body("checklist_id")
    .notEmpty()
    .withMessage("checklist_id is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid checklist_id");
      }
      return true;
    }),

  body("answered_by")
    .notEmpty()
    .withMessage("answered_by is required")
    .custom(async (value, {req}) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid answered_by");
      }
      let order = await Order.findById(req.body.order_id);
      if (order.inspection_manager !== value) {
        throw new ForbiddenError("This is not your checklist, please connect your procurement manager or admin")
      }
      return true;
    }),
  body("items")
    .optional()
    .isArray()
    .withMessage("items must be an array"),
  body("submitted_at")
    .optional()
    .isISO8601()
    .withMessage("submitted_at must be a valid date"),
];


