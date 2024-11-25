const express = require('express');
const {
  addCityImage,
  getCityImages,
  getCityImageById,
  updateCityImage,
  deleteCityImage
} = require('../controllers/cityImageController');

const router = express.Router();

// Yeni Kent İmgesi Ekle
router.post('/', addCityImage);

// Tüm Kent İmgelerini Listele
router.get('/', getCityImages);

// Belirli Bir Kent İmgesini Getir
router.get('/:id', getCityImageById);

// Kent İmgesini Güncelle
router.put('/:id', updateCityImage);

// Kent İmgesini Sil
router.delete('/:id', deleteCityImage);

module.exports = router;
