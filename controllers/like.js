const Recipe = require('../models/Recipe');
const asyncHandler = require('../middleware/async');

// @desc    Like a recipe
// @route   PUT /api/v1/recipes/:id/like
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
// @route   PUT /api/v1/recipes/:id/unlike
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
