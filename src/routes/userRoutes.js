const express = require('express');
const { 
  login, 
  createUser, 
  listUsers, 
  updateUser,
  verifyEmail,
  deleteUser
  
} = require('../controllers/userController'); // Controller'ı doğru yoldan alın

const router = express.Router();

// Giriş Yapma
router.post('/login', login);

//eposta onay
router.get('/verify-email/:token', verifyEmail);

// Yeni Kullanıcı Ekleme (Sadece Admin)
router.post('/create', createUser);

// Tüm Kullanıcıları Listeleme (Sadece Admin)
router.get('/', listUsers);

// Kullanıcı Güncelleme (Sadece Admin)
router.put('/update/:id', updateUser);

router.delete('/users/:id', deleteUser);

module.exports = router;
