const express = require('express');
const {
  addCityImage,
  getCityImages,
  getCityImageById,
  updateCityImage,
  deleteCityImage,
} = require('../controllers/cityImageController');
const upload = require('../middleware/multer'); // Multer middleware

const router = express.Router();

// Yeni Kent İmgesi Ekle
router.post(
  '/',
  upload.fields([
    { name: 'coverImage', maxCount: 1 }, // Kapak resmi (sadece 1 tane)
    { name: 'galleryImages', maxCount: 6 }, // Maksimum 6 galeri görseli
  ]),
  addCityImage
);

// Tüm Kent İmgelerini Listele
router.get('/', getCityImages);

// Belirli Bir Kent İmgesini Getir
router.get('/:id', getCityImageById);

// Kent İmgesini Güncelle
router.put(
  '/:id',
  upload.fields([
    { name: 'coverImage', maxCount: 1 }, // Kapak resmi (isteğe bağlı güncelleme)
    { name: 'galleryImages', maxCount: 6 }, // Maksimum 6 galeri görseli (isteğe bağlı güncelleme)
  ]),
  updateCityImage
);

// Kent İmgesini Sil
router.delete('/:id', deleteCityImage);

module.exports = router;
