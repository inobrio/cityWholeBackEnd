const express = require('express');
const Country = require('../models/country');
const router = express.Router();


router.get('/count', async (req, res) => {
  try {
    const count = await Country.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Ülke sayısı alınırken hata:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

// Tüm Ülkeleri Listele
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

// Belirli Bir Ülkeyi Getir
router.get('/:code', async (req, res) => {
  try {
    const country = await Country.findOne({ code: req.params.code });
    if (!country) return res.status(404).json({ message: 'Ülke bulunamadı!' });

    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});

// Yeni Ülke Ekle
router.post('/', async (req, res) => {
  const { name, code, cities } = req.body;

  try {
    const existingCountry = await Country.findOne({ code });
    if (existingCountry) return res.status(400).json({ message: 'Bu ülke zaten mevcut!' });

    const country = new Country({ name, code, cities });
    await country.save();
    res.status(201).json({ message: 'Ülke başarıyla eklendi!', country });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});



// Ülke Silme
router.delete('/:id', async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) return res.status(404).json({ message: 'Ülke bulunamadı!' });

    res.status(200).json({ message: 'Ülke başarıyla silindi!', country });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});


// Ülke Güncelleme
router.put('/:id', async (req, res) => {
  const { name, code, cities } = req.body; 

  try {
    // 'code' alanının benzersizliğini kontrol et
    if (code) {
      const existingCountry = await Country.findOne({ code, _id: { $ne: req.params.id } });
      if (existingCountry) {
        return res.status(400).json({ message: 'Bu ülke kodu zaten kullanılıyor!' });
      }
    }

    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      { name, code, cities }, 
      { new: true, runValidators: true } 
    );

    if (!updatedCountry) {
      return res.status(404).json({ message: 'Ülke bulunamadı!' });
    }

    res.status(200).json({ message: 'Ülke başarıyla güncellendi!', updatedCountry });
  } catch (error) {
    console.error('Ülke Güncelleme Hatası:', error);
    res.status(500).json({ message: 'Bir hata oluştu', error });
  }
});



module.exports = router;
