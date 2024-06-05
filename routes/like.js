const express = require('express');
const {
    likeRecipe,
    unlikeRecipe,
    getTopLikedRecipes,
    getLikedRecipes
} = require('../controllers/like');
const { protect } = require('../middleware/auth');
const router = express.Router();
const cors = require('cors');

const corsOptions = {
    origin: 'https://www.nileshblog.tech/',
    optionsSuccessStatus: 200,
};

/**
 * @swagger
 * /like/topliked:
 *   get:
 *     summary: Get top liked recipes
 *     description: Retrieve a list of the top 10 liked recipes.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 */
router.get('/topliked', cors(corsOptions), getTopLikedRecipes);

/**
 * @swagger
 * /like/liked:
 *   get:
 *     summary: Get liked recipes by the logged-in user
 *     description: Retrieve a list of recipes liked by the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 */
router.get('/liked', protect, cors(corsOptions), getLikedRecipes);

/**
 * @swagger
 * /like/{id}/like:
 *   put:
 *     summary: Like a recipe
 *     description: Like a specific recipe by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the recipe to like.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 */
router.put('/:id/like', protect, cors(corsOptions), likeRecipe);

/**
 * @swagger
 * /like/{id}/unlike:
 *   put:
 *     summary: Unlike a recipe
 *     description: Unlike a specific recipe by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the recipe to unlike.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 */
router.put('/:id/unlike', protect, cors(corsOptions), unlikeRecipe);

module.exports = router;
