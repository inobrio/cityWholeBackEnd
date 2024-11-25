const Firm = require('../models/firm');

// Tüm Firmaları Listele
exports.getFirms = async (req, res) => {
  try {
    const firms = await Firm.find();
    res.status(200).json(firms);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Yeni Firma Ekle
exports.addFirm = async (req, res) => {
  const { name, category, description, contact } = req.body;

  try {
    const existingFirm = await Firm.findOne({ name });
    if (existingFirm) return res.status(400).json({ message: 'Bu firma zaten mevcut!' });

    const firm = new Firm({ name, category, description, contact });
    await firm.save();
    res.status(201).json({ message: 'Firma başarıyla eklendi!', firm });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Firmayı Güncelle
exports.updateFirm = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedFirm = await Firm.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedFirm) return res.status(404).json({ message: 'Firma bulunamadı!' });

    res.status(200).json({ message: 'Firma başarıyla güncellendi!', updatedFirm });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Firmayı Sil
exports.deleteFirm = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFirm = await Firm.findByIdAndDelete(id);
    if (!deletedFirm) return res.status(404).json({ message: 'Firma bulunamadı!' });

    res.status(200).json({ message: 'Firma başarıyla silindi!', deletedFirm });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
