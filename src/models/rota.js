const mongoose = require('mongoose');

const RotaSchema = new mongoose.Schema({
    baslik: { type: String, required: true }, // Rota başlığı
    aciklama: { type: String, required: true }, // Rota açıklaması
    mesafe: { type: Number, required: true }, // Mesafe (ör. km cinsinden)
    imgeler: [String], // Kent imgeleri (URL veya dosya referansı)
    pinler: [
        {
            lat: { type: Number, required: true }, // Harita üzerinde enlem
            lng: { type: Number, required: true }, // Harita üzerinde boylam
            adres: String, // Adres metni
        },
    ],
    durum: { type: String, default: 'pending' }, // 'pending', 'approved', 'rejected'
    olusturan: { type: String, default: 'anonim' }, // Kullanıcı bilgisi (anonim ise anonim)
    olusturulmaTarihi: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rota', RotaSchema);
