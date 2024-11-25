const express = require('express');
const { getFirms, addFirm, updateFirm, deleteFirm } = require('../controllers/firmController');
const router = express.Router();

router.get('/', getFirms);
router.post('/', addFirm);
router.put('/:id', updateFirm);
router.delete('/:id', deleteFirm);

module.exports = router;
