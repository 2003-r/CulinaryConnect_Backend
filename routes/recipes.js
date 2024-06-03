const express = require('express');
const {
    getRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    RecipeUpload,
    advancedSearchRecipes
} = require('../controllers/recipes');

const router = express.Router();
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/recipes:
 *   get:
 *     summary: Get all recipes
 *     description: Retrieve a list of all recipes.
 *     responses:
 *       '200':
 *         description: A list of recipes.
 */
router.get('/advancesearchrecipes', advancedSearchRecipes);

/**
 * @swagger
 * /api/v1/recipes/{id}/photo:
 *   put:
 *     summary: Upload a photo for a recipe
 *     description: Upload a photo for a specific recipe by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the recipe.
 *         schema:
 *           type: string
 *       - in: formData
 *         name: photo
 *         type: file
 *         required: true
 *         description: The image file to upload.
 *     responses:
 *       '200':
 *         description: Recipe photo uploaded successfully.
 */
router.route('/:id/photo').put(protect, RecipeUpload);

/**
 * @swagger
 * /api/v1/recipes:
 *   get:
 *     summary: Get all recipes
 *     description: Retrieve a list of all recipes.
 *     responses:
 *       '200':
 *         description: A list of recipes.
 *   post:
 *     summary: Create a new recipe
 *     description: Create a new recipe.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *               time:
 *                 type: number
 *               servings:
 *                 type: number
 *               category:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: A new recipe created successfully.
 *     security:
 *        - BearerAuth: []
 * securityDefinitions:
 *    BearerAuth:
 *      type: apiKey
 *      name: Authorization
 *      in: header
 *      description: "Enter your bearer token in the format **Bearer &lt;token>**"
 */
router.route('/').get(getRecipes);
router.post('/', protect, createRecipe); 

/**
 * @swagger
 * /api/v1/recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     description: Retrieve a recipe by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the recipe.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The requested recipe.
 *   put:
 *     summary: Update a recipe
 *     description: Update a recipe by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the recipe.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The updated recipe.
 *   delete:
 *     summary: Delete a recipe
 *     description: Delete a recipe by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the recipe.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Recipe deleted successfully.
 */
router.route('/:id').get(getRecipe).put(protect, updateRecipe).delete(protect, deleteRecipe);

module.exports = router;
