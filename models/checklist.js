const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  question_type: { type: String, enum: ['BOOLEAN','DROPDOWN','MULTIPLE_CHOICE','TEXT','IMAGE_UPLOAD'], required: true },
  options: { type: [String], default: [] },
  is_required: { type: Boolean, default: true },
  order_index: { type: Number, default: 0 }
});

const checklistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "done"],
    default: "pending",
  },
  questions: [questionSchema],
  is_default: { type: Boolean, default: false }
}, { timestamps: true });

const Checklist = mongoose.model('Checklist', checklistSchema);
module.exports = Checklist;
