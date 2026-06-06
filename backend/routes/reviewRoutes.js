const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  getProductReviews,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.get('/product/:productId', getProductReviews);
router.get('/my', protect, getMyReviews);

module.exports = router;
