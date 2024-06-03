const Recipe = require('../models/Recipe');
const asyncHandler = require('../middleware/async');

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         likes:
 *           type: integer
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 */

// @desc    Get top liked recipes
// @route   GET /api/v1/like/topliked
// @access  Public
exports.getTopLikedRecipes = asyncHandler(async (req, res, next) => {
    // Get the Recipes and sorting them in descending order
    const recipes = await Recipe.find().sort({likes: -1}).limit(10);

    res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes
    });
});

// @desc    Get liked recipes by logge in user
// @route   GET /api/v1/like/liked
// @access  Private
exports.getLikedRecipes = asyncHandler(async (req, res, next) => {
    // Get the Recipes and sorting them in descending order
    const recipes = await Recipe.find({ likedBy: req.user.id });

    res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes
    });
});

// @desc    Like a recipe
// @route   PUT /api/v1/like/:id/like
// @access  Private
exports.likeRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    if (recipe.likedBy.includes(req.user.id)) {
        return res.status(400).json({ success: false, error: 'Recipe already liked' });
    }

    recipe.likes += 1;
    recipe.likedBy.push(req.user.id);

    await recipe.save();

    res.status(200).json({
        success: true,
        data: recipe
    });
});

// @desc    Unlike a recipe
// @route   PUT /api/v1/like/:id/unlike
// @access  Private
exports.unlikeRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    if (!recipe.likedBy.includes(req.user.id)) {
        return res.status(400).json({ success: false, error: 'Recipe not liked yet' });
    }

    recipe.likes -= 1;
    recipe.likedBy = recipe.likedBy.filter(userId => userId.toString() !== req.user.id);

    await recipe.save();

    res.status(200).json({
        success: true,
        data: recipe
    });
});
