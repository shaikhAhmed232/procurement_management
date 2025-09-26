const Checklist = require('../models/checklist');
const Order = require("../models/order");
const { BadRequestError, ForbiddenError, NotFoundError } = require("../lib/errors");
const { userRoles, statusCode } = require('../lib/constants');

exports.create = async (req, res) => {
    const { name, description, questions, is_default } = req.body;
    // questions should be array of objects with question_text, question_type, options, is_required, order_index
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new BadRequestError('Checklist must contain questions');
    }
    const checklist = new Checklist({
      name,
      description,
      created_by: req.user._id,
      questions,
      is_default: !!is_default
    });
    await checklist.save();
    res.status(201).json(checklist);
};

// fetch all checklists (admin/procurement)
exports.list = async (req, res) => {
    const role = req.user.role;
    const query = {};
    switch (role) {
        case userRoles.PROCUREMENT_MANAGER:
            query["created_by"] = req.user._id;
            break;
        case userRoles.INSPECTION_MANAGER:
            const orders = await Order.find({inspection_manager: req.user._id});
            query["_id"] = {
                $in: orders.map((order) => order.checklist)
            };
            break;
        default:
            break;
    }
    const list = await Checklist.find(query);
    res.status(statusCode.OK).json(list);
};

exports.getById = async (req, res) => {
    const {checklistId} = req.params;
    const role = req.user.role;

    const query = {
        _id: checklistId,
    };
    switch (role) {
        case userRoles.PROCUREMENT_MANAGER:
            query["created_by"] = req.user._id;
            break;
        case userRoles.INSPECTION_MANAGER:
            const orders = await Order.find({inspection_id: req.user._id, checklist_id: checklistId});
            if (orders.length === 0) {
                throw new ForbiddenError("Forbidden:Cannot access this checklist");
            }
            break;
        default:
            break;
    }
    const checklist = await Checklist.findOne(query);
    if (!checklist) {
        throw new NotFoundError('Checklist not found');
    }
    res.status(statusCode.OK)
        .json(checklist);
}

exports.update = async (req, res) => {
    const { checklistId } = req.params;
    const data = req.body;
    const role = req.user.role;
    const filter = {
        _id: checklistId,
    };
    if (role === userRoles.PROCUREMENT_MANAGER) {
        filter["created_by"] = req.user._id;
    }
    let checklist = await Checklist.findOne(filter);
    if (!checklist) throw new NotFoundError("Check list not found");
    if (role === userRoles.INSPECTION_MANAGER) {
        const order = await Order.findOne({
            checklist_id: checklistId,
            inspection_id: req.user._id,
            status: {
                $ne: "done"
            }
        })
        if (!order) {
            throw new NotFoundError("Check list either completed or you don't have access");
        }
        data = {
            status: data.status,
        };
    }
    checklist = await Checklist.findOneAndUpdate(filter, data);
    res.status(statusCode.OK)
        .json(checklist);
}

exports.delete = async (req, res) => {
    const { checklistId } = req.params;
    const data = req.body;
    const filter = {
        _id: checklistId,
    };
    let checklist = await Checklist.findOne(filter);
    if (!checklist) throw new NotFoundError("Check list not found");
    checklist = await Checklist.findOneAndDelete(filter, data);
    res.status(statusCode.OK)
        .json(checklist);
}
