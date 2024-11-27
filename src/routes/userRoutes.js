const express = require('express');
const { 
  login, 
  createUser, 
  listUsers, 
  updateUser,
} = require('../controllers/userController'); // Controller'ı doğru yoldan alın

const router = express.Router();

// Giriş Yapma
router.post('/login', login);

// Yeni Kullanıcı Ekleme (Sadece Admin)
router.post('/create', createUser);

// Tüm Kullanıcıları Listeleme (Sadece Admin)
router.get('/', listUsers);

// Kullanıcı Güncelleme (Sadece Admin)
router.put('/update/:id', updateUser);

module.exports = router;
