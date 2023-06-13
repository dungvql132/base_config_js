const mongoose = require("mongoose");

const loggerSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ["error", "warning", "info"],
        required: true
    },
    user: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Logger = mongoose.model("Logger", loggerSchema);

module.exports = {
    Logger
};
