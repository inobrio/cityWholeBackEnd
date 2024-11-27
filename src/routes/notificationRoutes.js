const express = require('express');
const { sendNotificationToUsers } = require('../controllers/notificationController');

const router = express.Router();

// Bildirim gönderme route'u
router.post('/send', sendNotificationToUsers);

module.exports = router;
