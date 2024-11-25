const express = require('express');
const { getTours, addTour, updateTour, deleteTour } = require('../controllers/tourController');
const router = express.Router();

router.get('/', getTours);
router.post('/', addTour);
router.put('/:id', updateTour);
router.delete('/:id', deleteTour);

module.exports = router;
