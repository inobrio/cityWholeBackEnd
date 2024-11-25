const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user' },
    name: { type: String, required: true }, // Ad
    surname: { type: String, required: true }, // Soyad
    phone: { type: String, unique: true }, // Telefon (benzersiz, opsiyonel)
    email: { type: String, unique: true } // E-posta (benzersiz, opsiyonel)
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
