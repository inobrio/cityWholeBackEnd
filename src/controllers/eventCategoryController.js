const EventCategory = require('../models/eventCategory');

// Etkinlik Türü Ekleme
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const existingCategory = await EventCategory.findOne({ name });
    if (existingCategory) return res.status(400).json({ message: 'Bu kategori zaten mevcut!' });

    const category = new EventCategory({ name });
    await category.save();

    res.status(201).json({ message: 'Kategori başarıyla oluşturuldu!', category });
  } catch (error) {
    console.error('Kategori Ekleme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Tüm Kategorileri Listeleme
exports.listCategories = async (req, res) => {
  try {
    const categories = await EventCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Kategori Listeleme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kategori Güncelleme
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await EventCategory.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedCategory) return res.status(404).json({ message: 'Kategori bulunamadı!' });

    res.status(200).json({ message: 'Kategori başarıyla güncellendi!', updatedCategory });
  } catch (error) {
    console.error('Kategori Güncelleme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Kategori Silme
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await EventCategory.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ message: 'Kategori bulunamadı!' });

    res.status(200).json({ message: 'Kategori başarıyla silindi!', deletedCategory });
  } catch (error) {
    console.error('Kategori Silme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
