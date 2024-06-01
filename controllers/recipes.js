// @desc    Get all Recipes
// @route   GET /api/v1/Recipes
// @access  Public
exports.getRecipes = (req, res, next) => {
    res.status(200).json({success: true, msg:'Show all Recipes'});
}

// @desc    Get Single Recipe
// @route   GET /api/v1/Recipes/:id
// @access  Public
exports.getRecipe = (req, res, next) => {
    res.status(200).json({success: true, msg:`Get Recipe ${req.params.id}`});
}

// @desc    Create new Recipe
// @route   POST /api/v1/Recipes
// @access  Private
exports.createRecipe = (req, res, next) => {
    res.status(200).json({success: true, msg:'Create a new Recipe'});
}

// @desc    Update Recipe
// @route   PUT /api/v1/Recipes/:id
// @access  Private
exports.updateRecipe = (req, res, next) => {
    res.status(200).json({success: true, msg:`Update Recipe ${req.params.id}`});
}

// @desc    Delete Recipe
// @route   DELETE /api/v1/Recipes/:id
// @access  Private
exports.deleteRecipe = (req, res, next) => {
    res.status(200).json({success: true, msg:`Delete Recipe ${req.params.id}`});
}
