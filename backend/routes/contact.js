const router = require('express').Router();
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String, phone: String, address: String, note: String
}, { timestamps: true });
const Contact = mongoose.model('Contact', contactSchema);

router.post('/', async (req, res) => {
  try {
    await Contact.create(req.body);
    res.status(201).json({ message: 'Đã ghi nhận!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;