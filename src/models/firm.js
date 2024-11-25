const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  contact: {
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Firm', firmSchema);
