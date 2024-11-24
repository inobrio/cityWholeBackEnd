const express = require('express');
const {
  login,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Giriş Yapma
router.post('/login', login);

// Kullanıcı Ekleme
router.post('/create', createUser);

// Kullanıcı Güncelleme
router.put('/update/:id', authenticateToken, updateUser);

// Kullanıcı Silme
router.delete('/delete/:id', authenticateToken, deleteUser);

module.exports = router;
