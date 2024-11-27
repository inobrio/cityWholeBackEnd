const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'EventCategory', required: true }, // Etkinlik Türü
    address: { type: String, required: true },
    contactInfo: { type: String }, // Telefon veya E-posta
    price: { type: String, default: 'Ücretsiz' }, // Varsayılan olarak "Ücretsiz"
    features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' }], // Mekan Özellikleri
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
