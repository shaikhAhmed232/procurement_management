const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  procurement_manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inspection_manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checklist: { type: mongoose.Schema.Types.ObjectId, ref: 'Checklist', required: true },
  status: { type: String, enum: ['created','in_progress','completed','rejected'], default: 'created' },
  meta: { type: Object } // any order-specific details
}, { timestamps: true });


const Order = mongoose.model('Order', orderSchema);
module.exports = Order; 