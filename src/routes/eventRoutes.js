const express = require('express');
const { createEvent, listEvents, updateEvent, deleteEvent } = require('../controllers/eventController');

const router = express.Router();

// Etkinlik CRUD
router.post('/create', createEvent);
router.get('/', listEvents);
router.put('/update/:id', updateEvent);
router.delete('/delete/:id', deleteEvent);

module.exports = router;
