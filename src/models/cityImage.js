// models/CityImage.js
const mongoose = require('mongoose');

const cityImageSchema = new mongoose.Schema(
  {
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Ülke seçilmesi zorunludur.'],
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'Şehir seçilmesi zorunludur.'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Kategori seçilmesi zorunludur.'],
    },
    title: {
      type: String,
      required: [true, 'Başlık alanı boş geçilemez.'],
      minlength: [5, 'Başlık en az 5 karakter olmalıdır.'],
    },
    coverImage: {
      type: String,
      required: [true, 'Kapak resmi yüklenmelidir.'],
    },
    galleryImages: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= 6;
        },
        message: 'En fazla 6 galeri görseli eklenebilir!',
      },
      required: [true, 'Galeri görselleri eklenmelidir (en az 1, max 6).'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Açıklama 1000 karakteri aşmamalı.'],
      required: [true, 'Açıklama girilmesi gerekmektedir.'],
    },
    address: {
      text: {
        type: String,
        required: [true, 'Adres metni girilmelidir.'],
      },
      mapUrl: {
        type: String,
        required: [true, 'Harita URL bilgisi girilmelidir.'],
      },
    },
    latitude: {
      type: Number,
      min: [-90, 'Enlem -90 ile 90 arasında olmalı'],
      max: [90, 'Enlem -90 ile 90 arasında olmalı'],
      required: [true, 'Enlem bilgisi girilmelidir.'],
    },
    longitude: {
      type: Number,
      min: [-180, 'Boylam -180 ile 180 arasında olmalı'],
      max: [180, 'Boylam -180 ile 180 arasında olmalı'],
      required: [true, 'Boylam bilgisi girilmelidir.'],
    },
    fee: {
      type: String,
      required: [true, 'Ücret bilgisi girilmelidir. (Ücretsiz ise "Ücretsiz" yazabilirsiniz)'],
    },
    editorNotes: {
      type: String,
      required: [true, 'Editör notları girilmelidir.'],
    },
    features: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Attribute',
      required: [true, 'En az bir özellik seçmelisiniz.'],
      validate: {
        validator: function (value) {
          // "value" -> features dizisi
          return Array.isArray(value) && value.length > 0
        },
        message: 'En az bir özellik seçmelisiniz!',
      },
    },
    contact: {
      phone: {
        type: String,
        required: [true, 'Telefon numarası girilmelidir.'],
      },
      email: {
        type: String,
        // match: [/.+@.+\..+/, 'Geçerli bir email adresi girin.'],
        required: [true, 'Email adresi girilmelidir.'],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CityImage', cityImageSchema);
