const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user' },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    isEmailVerified: { type: Boolean, default: false }, // E-posta doğrulandı mı
    emailVerificationToken: { type: String }, // E-posta doğrulama token'ı
    otpCode: { type: String }, // Kullanıcıya gönderilen doğrulama kodu
    otpExpiresAt: { type: Date } // Doğrulama kodunun geçerlilik süresi
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
