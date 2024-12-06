const express = require('express');
const router = express.Router();
const RotaController = require('../controllers/rotaController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Kullanıcı rota oluşturur
router.post('/', RotaController.createRota);

// Admin tüm rotaları listeler
router.get('/', verifyToken, RotaController.getAllRotas);

// Belirli bir rotayı admin onaylar veya reddeder
router.put('/:id', verifyToken, RotaController.updateRotaStatus);

module.exports = router;
