const express = require('express');
const {
    getRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    RecipeUpload
} = require('../controllers/recipes');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.route('/:id/photo').put(protect, RecipeUpload);
router.route('/').get(getRecipes).post(protect, createRecipe);
router.route('/:id').get(getRecipe).put(protect, updateRecipe).delete(protect, deleteRecipe);

module.exports = router;
