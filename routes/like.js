const express = require('express');
const { likeRecipe, unlikeRecipe, getTopLikedRecipes, getLikedRecipes} = require('../controllers/like'); 
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/topliked', getTopLikedRecipes);
router.get('/liked', protect, getLikedRecipes);
router.put('/:id/like', protect, likeRecipe);
router.put('/:id/unlike', protect, unlikeRecipe);

module.exports = router; // Make sure you export the router
