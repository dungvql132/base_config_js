require("dotenv").config();
const jwt = require("jsonwebtoken");

async function checkTokenMiddleware(req, res, next) {
    try {
        // Get the token from the header
        const token = req.headers.authorization;
        console.log("req.headers: ", req.headers);

        if (!token) {
            // Token does not exist
            return res
                .status(401)
                .json({ success: false, message: "Token not found" });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Save user information in req.body.user
        req.body.user = decoded;

        // Proceed to the next middleware or route
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}

module.exports = {
    checkTokenMiddleware
};
