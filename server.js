const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database 
connectDB();

// Route Files
const recipes = require('./routes/recipes');
const auth = require('./routes/auth');
const like = require('./routes/like');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser 
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading 
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security header
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// // Rate limiting
// const limiter = rateLimit({
//     windowMs: 10* 60 * 1000, // 10 mins
//     max: 100
// })

// app.use(limiter);

// // Prevent http param polution
// app.use(hpp);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log('Request body:', req.body);
    next();
});

// Mount routers
app.use('/api/v1/recipes', recipes);
app.use('/api/v1/auth', auth);
app.use('/api/v1/like', like);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});
