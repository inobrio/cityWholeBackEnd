const express = require('express');
const {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/eventCategoryController');

const router = express.Router();

// CRUD İşlemleri
router.post('/create', createCategory);
router.get('/', listCategories);
router.put('/update/:id', updateCategory);
router.delete('/delete/:id', deleteCategory);

module.exports = router;
