const express = require('express');
const Attribute = require('../models/attribute');
const router = express.Router();

// Tüm Özellikleri Listele
router.get('/', async (req, res) => {
  try {
    const attributes = await Attribute.find();
    res.status(200).json(attributes);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

// Yeni Özellik Ekle
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingAttribute = await Attribute.findOne({ name });
    if (existingAttribute) return res.status(400).json({ message: 'Bu özellik zaten mevcut!' });

    const attribute = new Attribute({ name, description });
    await attribute.save();
    res.status(201).json({ message: 'Özellik başarıyla eklendi!', attribute });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

// Özelliği Düzenle
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedAttribute = await Attribute.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedAttribute) return res.status(404).json({ message: 'Özellik bulunamadı!' });

    res.status(200).json({ message: 'Özellik başarıyla güncellendi!', updatedAttribute });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

// Özelliği Sil
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAttribute = await Attribute.findByIdAndDelete(id);
    if (!deletedAttribute) return res.status(404).json({ message: 'Özellik bulunamadı!' });

    res.status(200).json({ message: 'Özellik başarıyla silindi!', deletedAttribute });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

module.exports = router;
