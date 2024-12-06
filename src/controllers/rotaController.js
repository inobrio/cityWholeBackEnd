const RotaModel = require('../models/rota');

// Rota oluşturma
exports.createRota = async (req, res) => {
    try {
        const { baslik, aciklama, mesafe, imgeler, pinler } = req.body;

        const yeniRota = new RotaModel({
            baslik,
            aciklama,
            mesafe,
            imgeler,
            pinler,
            durum: 'pending',
        });

        await yeniRota.save();
        res.status(201).json({ message: 'Rota başarıyla oluşturuldu.', rota: yeniRota });
    } catch (error) {
        res.status(500).json({ message: 'Rota oluşturulamadı.', error });
    }
};

// Tüm rotaları listeleme (Admin için)
exports.getAllRotas = async (req, res) => {
    try {
        const rotalar = await RotaModel.find();
        res.status(200).json(rotalar);
    } catch (error) {
        res.status(500).json({ message: 'Rotalar alınamadı.', error });
    }
};

// Rota durumunu güncelleme (Admin onayı/reddi)
exports.updateRotaStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { durum } = req.body;

        const rota = await RotaModel.findByIdAndUpdate(id, { durum }, { new: true });

        if (!rota) return res.status(404).json({ message: 'Rota bulunamadı.' });

        res.status(200).json({ message: 'Rota durumu güncellendi.', rota });
    } catch (error) {
        res.status(500).json({ message: 'Rota durumu güncellenemedi.', error });
    }
};
