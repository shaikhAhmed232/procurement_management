const Answer = require('../models/answer');
const Order = require('../models/order');
const Checklist = require('../models/checklist');
const { NotFoundError } = require('../lib/errors');
const { statusCode } = require('../lib/constants');

exports.submitAnswer = async (req, res) => {
    const { order_id, items } = req.body;
    // validate
    const order = await Order.findById(order_id);
    if (!order) throw new NotFoundError('Order not found');
    const checklist = await Checklist.findById(order.checklist_id);
    if (!checklist) throw new NotFoundError('Checklist template not found');

    const snapshotItems = items.map((it, idx) => {
      const q = checklist.questions[idx];
      return {
        question_snapshot: {
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          is_required: q.is_required
        },
        answer_value: it.answer_value,
        file_urls: it.file_urls || []
      };
    });

    const answer = new Answer({
      order_id,
      checklist_id: checklist._id,
      answered_by: req.user._id,
      items: snapshotItems
    });
    await answer.save();

    res.status(statusCode.CREATED).json(answer);
};

exports.uploadFiles = async (req, res) => {
    const files = req.files.map((file) => ({url: file.path, type: file.mimetype, size: file.size, name: file.filename}))
    res.status(statusCode.OK).json(files);
}

