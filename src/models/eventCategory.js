const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Örn: Konser, Festival
});

module.exports = mongoose.model('EventCategory', eventCategorySchema);
