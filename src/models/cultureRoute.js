// models/CultureRoute.js
const mongoose = require('mongoose');

const cultureRouteSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true },
    description: { type: String },
    cityImages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CityImage', required: true, max: 10 }], // Maksimum 10 kent imgesi
    createdBy: { type: String, required: true }, // Kullanıcı kimliği
  },
  { timestamps: true }
);

module.exports = mongoose.model('CultureRoute', cultureRouteSchema);
