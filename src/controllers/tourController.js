const Tour = require('../models/tour');
const path = require('path');

// Tüm Turları Listele
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find().populate('firm', 'name');
    res.status(200).json(tours);
  } catch (error) {
    console.error('Turlar listelenirken hata oluştu:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Yeni Tur Ekle
exports.addTour = async (req, res) => {
  try {
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // Göreceli yolu oluşturuyoruz
        const relativePath = path.join('uploads', 'tours', file.filename).replace(/\\/g, '/');
        images.push(relativePath);
      });
    }

    const {
      title,
      firm,
      category,
      description,
      fee,
      editorNotes,
      phone,
      email,
    } = req.body;

    const newTour = new Tour({
      title,
      firm,
      category,
      images,
      description,
      fee,
      editorNotes,
      contact: {
        phone,
        email,
      },
    });

    const savedTour = await newTour.save();
    res.status(201).json({ message: 'Tur başarıyla eklendi!', tour: savedTour });
  } catch (error) {
    console.error('Tur eklenirken hata oluştu:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};

// Turu Güncelle
exports.updateTour = async (req, res) => {
  console.log('Gelen Veriler:', req.body);
  console.log('Dosyalar:', req.files);

  const { id } = req.params;
  try {
    let newImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const relativePath = path.join('uploads', 'tours', file.filename).replace(/\\/g, '/');
        newImages.push(relativePath);
      });
    }

    const {
      title,
      firm,
      category,
      description,
      fee,
      editorNotes,
      phone,
      email,
    } = req.body;

    console.log('Firm:', firm); // Firm verisi doğru mu?

    const updateData = {
      title,
      firm,
      category,
      description,
      fee,
      editorNotes,
      contact: {
        phone,
        email,
      },
    };

    if (newImages.length > 0) {
      updateData.images = newImages;
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate('firm', 'name');

    if (!updatedTour) {
      return res.status(404).json({ message: 'Tur bulunamadı!' });
    }

    res.status(200).json({ message: 'Tur başarıyla güncellendi!', updatedTour });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};


// Turu Sil
exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      return res.status(404).json({ message: 'Tur bulunamadı!' });
    }

    // İsteğe bağlı: Silinen turun görsellerini de silmek
    const fs = require('fs');
    deletedTour.images.forEach((imagePath) => {
      fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
        if (err) {
          console.error(`Görsel silinirken hata oluştu: ${imagePath}`, err);
        }
      });
    });

    res.status(200).json({ message: 'Tur başarıyla silindi!', deletedTour });
  } catch (error) {
    console.error('Tur silinirken hata oluştu:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
};
