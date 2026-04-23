const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  searchItems,
  getItemById,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// @route   GET /api/items/search?name=xyz
router.get('/search', searchItems);

// @route   POST /api/items
// @route   GET /api/items
router.route('/').post(createItem).get(getAllItems);

// @route   GET /api/items/:id
// @route   PUT /api/items/:id
// @route   DELETE /api/items/:id
router.route('/:id').get(getItemById).put(updateItem).delete(deleteItem);

module.exports = router;
