const express = require('express');
const cors = require('cors');
const {
    register,
    login,
    logout,
    getMe,
    forgotpassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

const corsOptions = {
    origin: 'http://localhost:3000', // replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
// routes/auth.js

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', cors(corsOptions), register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', cors(corsOptions), login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logout a user
 *     description: Logout the currently authenticated user.
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/logout', cors(corsOptions), logout);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Get details of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, cors(corsOptions), getMe);

/**
 * @swagger
 * /api/v1/auth/forgotpassword:
 *   post:
 *     summary: Forgot password
 *     description: Send a password reset link to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Bad request
 */
router.post('/forgotpassword', cors(corsOptions), forgotpassword);

/**
 * @swagger
 * /api/v1/auth/resetpassword/{resettoken}:
 *   put:
 *     summary: Reset password
 *     description: Reset the user's password using the reset token.
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         required: true
 *         description: Password reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 */
router.put('/resetpassword/:resettoken', cors(corsOptions), resetPassword);

/**
 * @swagger
 * /api/v1/auth/updatedetails:
 *   put:
 *     summary: Update user details
 *     description: Update the details of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/updatedetails', protect, cors(corsOptions), updateDetails);

/**
 * @swagger
 * /api/v1/auth/updatepassword:
 *   put:
 *     summary: Update user password
 *     description: Update the password of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/updatepassword', protect, cors(corsOptions), updatePassword);

module.exports = router;
