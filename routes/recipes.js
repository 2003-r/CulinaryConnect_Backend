const express = require('express');
const cors = require('cors');
const {
    getRecipes,
    getRecipe,
    getNewRecipes,
    getUserRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    RecipeUpload,
    SearchRecipes
} = require('../controllers/recipes');

const router = express.Router();
const { protect } = require('../middleware/auth');

const corsOptions = {
    origin: 'https://www.nileshblog.tech/',
    optionsSuccessStatus: 200,
  };

/**
 * @swagger
 * /api/v1/recipes/search:
 *   get:
 *     summary: Get all recipes
 *     description: Retrieve a list of all recipes.
 *     responses:
 *       '200':
 *         description: A list of recipes.
 */
router.get('/search',cors(corsOptions), SearchRecipes);

/**
 * @swagger
 * /api/v1/recipes/user:
 *   get:
 *     summary: Get recipes for the authenticated user
 *     description: Retrieve recipes for the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of recipes for the authenticated user.
 */
router.get('/user' ,protect , cors(corsOptions) , getUserRecipe);

/**
 * @swagger
 * /api/v1/recipes:
 *   get:
 *     summary: Get recipes for the authenticated user
 *     description: Retrieve recipes for the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of recipes for the authenticated user.
 */
router.get('/new' ,protect , cors(corsOptions) , getNewRecipes);

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
router.route('/:id/photo').put(protect, cors(corsOptions), RecipeUpload);

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
router.route('/').get(cors(corsOptions), getRecipes);
router.post('/', protect, cors(corsOptions), createRecipe); 

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
router.route('/:id').get(cors(corsOptions), getRecipe).put(protect, cors(corsOptions), updateRecipe).delete(protect, cors(corsOptions), deleteRecipe);

module.exports = router;
