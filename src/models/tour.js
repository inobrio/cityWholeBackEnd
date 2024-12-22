// models/Tour.js

const mongoose = require('mongoose');

// Firma Modeline Referans (Firmalarınızı temsil eden modelin adını ve yolu doğru olarak güncelleyin)
const Firm = require('./firm');

const ContactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Telefon numarası gerekli'],
    trim: true,
    match: [/^\+?[0-9\s\-()]{7,20}$/, 'Geçersiz telefon numarası formatı'],
  },
  email: {
    type: String,
    required: [true, 'Email gerekli'],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Geçersiz email formatı'],
  },
}, { _id: false });

const TourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tur başlığı gerekli'],
    trim: true,
    maxlength: [100, 'Başlık en fazla 100 karakter olmalıdır'],
  },
  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm',
    required: [true, 'Firma referansı gerekli'],
  },
  category: {
    type: String,
    required: [true, 'Kategori gerekli'],
    trim: true,
    maxlength: [50, 'Kategori en fazla 50 karakter olmalıdır'],
  },
  images: {
    type: [String], // Görsel URL'lerini veya dosya yollarını tutar
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'En az bir görsel gereklidir',
    },
  },
  description: {
    type: String,
    required: [true, 'Açıklama gerekli'],
    trim: true,
    maxlength: [1000, 'Açıklama en fazla 1000 karakter olmalıdır'],
  },
  fee: {
    type: Number,
    required: [true, 'Ücret gerekli'],
    min: [0, 'Ücret negatif olamaz'],
  },
  editorNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Editör notları en fazla 500 karakter olmalıdır'],
  },
  contact: {
    type: ContactSchema,
    required: [true, 'İletişim bilgileri gerekli'],
  },
}, {
  timestamps: true, // Oluşturma ve güncelleme zamanlarını otomatik ekler
});

// Sanal Alanlar veya Diğer Özelleştirmeler (Opsiyonel)
TourSchema.virtual('firmDetails', {
  ref: 'Firm',
  localField: 'firm',
  foreignField: '_id',
  justOne: true,
});

// Modeli Oluşturma
const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
