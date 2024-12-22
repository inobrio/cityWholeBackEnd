const express = require('express');
const router = express.Router();

const {
  getTours,
  addTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

// Multer middleware
const tourUpload = require('../middleware/tourUpload');

// Rota tanımlamaları
router.get('/', getTours);
router.post('/', tourUpload.array('images', 5), addTour);
router.put('/:id', tourUpload.array('images', 5), updateTour);
router.delete('/:id', deleteTour);

module.exports = router;
