const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: { type: String, enum: ['rose','lily','sunflower','orchid','mixed'], required: true },
  price:    { type: Number, required: true },
  emoji:    { type: String, default: '🌸' },
  desc:     { type: String },
  stock:    { type: Number, default: 100 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
