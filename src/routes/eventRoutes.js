// routes/eventRoutes.js
const express = require('express');
const { createEvent, listEvents, updateEvent, deleteEvent } = require('../controllers/eventController');
const upload = require('../middleware/eventUpload');

const router = express.Router();

// Etkinlik CRUD
router.post('/create', upload.single('image'), createEvent);
router.get('/', listEvents);
router.put('/update/:id', upload.single('image'), updateEvent);
router.delete('/delete/:id', deleteEvent);

module.exports = router;
