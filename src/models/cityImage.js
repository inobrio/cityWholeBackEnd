const mongoose = require('mongoose');

const cityImageSchema = new mongoose.Schema(
  {
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true },
    coverImage: { type: String, required: true }, // Kapak resmi
    galleryImages: {
      type: [String], // Dizideki elemanlar String olmalı
      validate: {
        validator: function (v) {
          // Maksimum 6 görsel olmalı
          return v.length <= 6;
        },
        message: 'Galeriye en fazla 6 görsel eklenebilir!',
      },
    },
    description: { type: String },
    address: {
      text: { type: String },
      mapUrl: { type: String },
    },
    fee: { type: String },
    editorNotes: { type: String },
    events: [{ type: String }],
    features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' }],
    contact: {
      phone: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CityImage', cityImageSchema);
