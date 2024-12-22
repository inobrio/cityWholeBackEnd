// models/event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'EventCategory', required: true },
    address: { type: String, required: true },
    contactInfo: { type: String },
    price: { type: String, default: 'Ücretsiz' },
    features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' }],
    image: { type: String, required: true } // Görsel yolu için alan
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
