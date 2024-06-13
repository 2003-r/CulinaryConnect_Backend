const Recipe = require('../models/Recipe');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all Recipes
// @route   GET /api/v1/recipes
// @access  Public
exports.getRecipes = asyncHandler(async (req, res, next) => {
    // Check if a search query parameter is provided
    const query = req.query.q;

    if (!query) {
        // If no search query is provided, retrieve all recipes
        const recipes = await Recipe.find();
        return res.status(200).json({
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
// @route   GET /api/v1/recipes/:id
// @access  Public
exports.getRecipe = asyncHandler(async (req, res, next) => {
    console.log(req.params.id);
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate('user', 'name');;

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

// @desc    Get newest Recipes
// @route   GET /api/v1/recipes/new
// @access  Public
exports.getNewRecipes = asyncHandler(async (req, res, next) => {
    // Retrieve the 10 most recent recipes
    const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(12);

    res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes
    });
});


// @desc    Get Recipe created by user
// @route   GET /api/v1/recipes/user
// @access  Private
exports.getUserRecipe = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    if (!userId) {
        return next(
            new ErrorResponse(`User id not found in the request`, 404)
        );
    }

    const recipes = await Recipe.find({ user: userId });
    if (!recipes || recipes.length === 0) {
        return next(
            new ErrorResponse(`Recipes not found for user with id ${userId}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes
    });
});

// @desc    Get top liked recipes
// @route   GET /api/v1/recipe/topliked
// @access  Public
exports.getTopLikedRecipes = asyncHandler(async (req, res, next) => {
    // Get the Recipes and sorting them in descending order
    const recipes = await Recipe.find().sort({likes: -1}).limit(12);

    res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes
    });
});


// @desc    Search recipes using search
// @route   GET /api/v1/recipes/search
// @access  Public
exports.searchRecipe = asyncHandler(async (req, res, next) => {
    const { q: search } = req.query;

    if (!search) {
        return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    // Use case-insensitive regex to match the name or ingredients
    const query = {
        $or: [
            { name: { $regex: new RegExp(search, 'i') } },
            { ingredients: { $regex: new RegExp(search, 'i') } }
        ]
    };

    const recipes = await Recipe.find(query);

    res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes
    });
});


// @desc    Create new Recipe with photo
// @route   POST /api/v1/recipes
// @access  Private
exports.createRecipe = asyncHandler(async (req, res, next) => {
    console.log('Creating a new recipe');

    // Add user to req.body
    req.body.user = req.user.id;

    // Parse ingredients from req.body
    const ingredients = [];
    for (let i = 0; req.body[`ingredients[${i}]`]; i++) {
        ingredients.push(req.body[`ingredients[${i}]`]);
    }
    req.body.ingredients = ingredients;

    // Check if files are included in the request
    if (!req.files || !req.files.file) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Check if the file is an image
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`), 400);
    }

    // Read the file data
    const fileData = file.data;

    // Create the recipe with the uploaded photo data
    const recipe = await Recipe.create({
        ...req.body,
        photo: fileData // Save the file data to the 'photo' field
    });

    res.status(201).json({
        success: true,
        data: recipe
    });
});


// @desc    Update Recipe
// @route   PUT /api/v1/recipes/:id
// @access  Private
exports.updateRecipe = asyncHandler(async (req, res, next) => {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is Recipe owner
    if (recipe.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this recipe`, 401));
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: recipe
    });
});


// @desc    Delete Recipe
// @route   DELETE /api/v1/recipes/:id
// @access  Private
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is Recipe owner
    if (recipe.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this recipe`, 401));
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});


// @desc    Upload photo for Recipe
// @route   PUT /api/v1/recipes/:id/photo
// @access  Private
exports.RecipeUpload = asyncHandler(async (req, res, next) => {
    console.log('Received request:', req.method, req.url);
    console.log('Request files:', req.files); // Log the files received
  
    const recipe = await Recipe.findById(req.params.id);
  
    if (!recipe) {
      return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is Recipe owner
    if (recipe.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this recipe`, 401));
    }

    let updatedRecipe; // Changed the variable name

    updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
  
    if (!req.files || !req.files.file) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Check if the file is an image
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`), 400);
    }

    // Create custom filename 
    file.name = `photo_${recipe._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err);
            return next(
                new ErrorResponse(`Problem with file upload`, 500)
            )
        }

        await Recipe.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });

    console.log(file.name);
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
