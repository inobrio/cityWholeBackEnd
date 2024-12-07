const mongoose = require('mongoose');

const NoktaSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  aciklama: { type: String }
});

const RotaSchema = new mongoose.Schema({
  rotaAdi: { type: String, required: true },
  aciklama: { type: String },
  baslangicNoktasi: { type: NoktaSchema, required: true },
  bitisNoktasi: { type: NoktaSchema, required: true },
  araNoktalar: [NoktaSchema],
  ratings: { type: [Number], default: [] },
  averageRating: { type: Number, default: 0 },
  onayDurumu: { type: Boolean, default: false }, // Admin onayı
  olusturulmaTarihi: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rota', RotaSchema);