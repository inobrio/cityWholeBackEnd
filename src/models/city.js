const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true } // Ülke ile ilişkilendirme
});

module.exports = mongoose.model('City', citySchema);
