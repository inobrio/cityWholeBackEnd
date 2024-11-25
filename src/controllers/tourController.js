const Tour = require('../models/tour');

// Tüm Turları Listele
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find().populate('firm', 'name');
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Yeni Tur Ekle
exports.addTour = async (req, res) => {
  const { title, firm, category, images, description, fee, editorNotes, contact } = req.body;

  try {
    const tour = new Tour({ title, firm, category, images, description, fee, editorNotes, contact });
    await tour.save();
    res.status(201).json({ message: 'Tur başarıyla eklendi!', tour });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Turu Güncelle
exports.updateTour = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTour = await Tour.findByIdAndUpdate(id, updateData, { new: true }).populate('firm', 'name');
    if (!updatedTour) return res.status(404).json({ message: 'Tur bulunamadı!' });

    res.status(200).json({ message: 'Tur başarıyla güncellendi!', updatedTour });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Turu Sil
exports.deleteTour = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) return res.status(404).json({ message: 'Tur bulunamadı!' });

    res.status(200).json({ message: 'Tur başarıyla silindi!', deletedTour });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
