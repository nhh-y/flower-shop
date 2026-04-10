const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String },
  items: [{
    productId: String,
    name:      String,
    price:     Number,
    qty:       Number,
  }],
  total:  { type: Number, required: true },
  status: { type: String, enum: ['pending','confirmed','delivered','cancelled'], default: 'pending' },
  note:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);