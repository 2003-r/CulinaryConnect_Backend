const Recipe = require('../models/Recipe');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all Recipes
// @route   GET /api/v1/recipes
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
// @route   GET /api/v1/recipes/:id
// @access  Public
exports.getRecipe = asyncHandler(async (req, res, next) => {
    console.log(req.params.id);
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

// @desc    Search recipes using advanced fuzzy search
// @route   GET /api/v1/recipes/advanced-search
// @access  Public
exports.advancedSearchRecipes = asyncHandler(async (req, res, next) => {
    const { query } = req.query;
    const regex = new RegExp(query, 'i'); // 'i' for case-insensitive

    const recipes = await Recipe.aggregate([
        {
            $match: {
                $or: [
                    { name: { $regex: regex } },
                    { description: { $regex: regex } },
                    { ingredients: { $regex: regex } }
                ]
            }
        }
    ]);

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
    console.log('Creating a new recipe'); // Debugging log
    console.log('Request body:', req.body); // Debugging log

    // Add user to req.body
    req.body.user = req.user.id;

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

    // Create custom filename 
    file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;

    // Move the file to the upload directory
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        // Create the recipe with the uploaded photo
        const recipe = await Recipe.create({
            ...req.body,
            photo: file.name
        });

        res.status(201).json({
            success: true,
            data: recipe
        });
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
