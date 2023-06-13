const winston = require("winston");
const { createLogger, format, transports } = require("winston");
const { Logger } = require("@src/model/Logger.model");

function generateLogger(link, type) {
    const logger = createLogger({
        format: format.combine(
            format.timestamp(), // Thêm thông tin thời gian
            format.simple() // Định dạng mặc định khác
        ),
        transports: [
            new transports.Console(),
            new winston.transports.File({ filename: link })
        ]
    });
    return (message, username) => {
        logger[type](message);
        const newLog = new Logger({
            level: type,
            user: username ? username : "",
            message: message
        });

        newLog.save();
    };
}

module.exports = {
    logger_info: generateLogger("info.log", "info"),
    logger_error: generateLogger("error.log", "error")
};
