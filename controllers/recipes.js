const Recipe = require('../models/Recipe');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all Recipes
// @route   GET /api/v1/Recipes
// @access  Public
exports.getRecipes = asyncHandler( async (req, res, next) => {
    // Check if a search query parameter is provided
    const query = req.query.q;

    if (!query) {
        // If no search query is provided, retrieve all recipes
        const recipes = await Recipe.find();
        res
            .status(200)
            .json({
                success: true,
                count: recipes.length,
                data: recipes
        });
    }

    // If a search query is provided, perform search
    const matchingRecipes = await searchRecipes(query);
    return res.status(200).json({
        success: true, 
        count: matchingRecipes.length, 
        data: matchingRecipes 
    });
    

});

// @desc    Get Single Recipe
// @route   GET /api/v1/Recipes/:id
// @access  Public
exports.getRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return next(
            new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: recipe
    });
});

// @desc    Create new Recipe
// @route   POST /api/v1/Recipes
// @access  Private
exports.createRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({
        success: true,
        data: recipe
    });
});

exports.updateRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!recipe) {
        return next(
            new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: recipe
    });
});

// @desc    Delete Recipe
// @route   DELETE /api/v1/recipes/:id
// @access  Private
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
        return next(
            new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});

// Function to search recipes
async function searchRecipes(query) {
    const matchingRecipes = await Recipe.find({
        $or: [
        { name: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for recipe name
        { ingredients: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for ingredients
        { category: { $regex: new RegExp(query, 'i') } } // Case-insensitive search for category
        ]
    });
    return matchingRecipes;
}
