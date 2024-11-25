const express = require('express');
const Category = require('../models/category');
const router = express.Router();

// Tüm Kategorileri Listele
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

// Yeni Kategori Ekle
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) return res.status(400).json({ message: 'Bu kategori zaten mevcut!' });

    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: 'Kategori başarıyla eklendi!', category });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

// Kategoriyi Düzenle
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: 'Kategori bulunamadı!' });

    res.status(200).json({ message: 'Kategori başarıyla güncellendi!', updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

// Kategoriyi Sil
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ message: 'Kategori bulunamadı!' });

    res.status(200).json({ message: 'Kategori başarıyla silindi!', deletedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

module.exports = router;
