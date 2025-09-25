const mongoose = require('mongoose');

const answerItemSchema = new mongoose.Schema({
  question_snapshot: { type: Object, required: true }, // copy of question (text, type, options, required)
  answer_value: { type: mongoose.Schema.Types.Mixed }, // string, boolean, array, etc.
  file_urls: { type: [String], default: [] }
});

const answerSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  checklist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Checklist', required: true },
  answered_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [answerItemSchema],
  submitted_at: { type: Date, default: Date.now }
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
