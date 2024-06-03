const express = require('express');
const { likeRecipe, unlikeRecipe } = require('../controllers/like'); // Ensure the path is correct
const { protect } = require('../middleware/auth');
const router = express.Router();

router.put('/:id/like', protect, likeRecipe);
router.put('/:id/unlike', protect, unlikeRecipe);

module.exports = router;
