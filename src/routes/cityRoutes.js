const express = require('express');
const {
  getCities,
  getCitiesByCountry,
  addCity,
  updateCity,
  deleteCity
} = require('../controllers/cityController');
const router = express.Router();

// Tüm Şehirleri Listele
router.get('/', getCities);

// Belirli Bir Ülkenin Şehirlerini Listele
router.get('/country/:countryId', getCitiesByCountry);

// Yeni Şehir Ekle
router.post('/', addCity);

// Şehri Güncelle
router.put('/:id', updateCity);

// Şehri Sil
router.delete('/:id', deleteCity);

module.exports = router;
