// @desc   Logs requesr to console
const logger = (req, res, next) => {
    req.helllo = 'Hello World';
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};

module.exports = logger;