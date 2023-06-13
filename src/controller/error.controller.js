const { logger_error } = require("@src/logger");

const handleErrorController = (err, req, res, next) => {
    // Log error
    logger_error(err.message, req.body.user ? req.body.user.username : "");

    // send to client
    res.status(500).json({
        error: err.message
    });
};

module.exports = { handleErrorController };
