const { Repository } = require("@src/entity/Repository");
const { UserEntity } = require("@src/entity/User.entity");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger_info } = require("@src/logger");
require("dotenv").config();

/**
 * Controller function for user registration.
 * It receives user data from the request body, hashes the password,
 * creates a new user in the database, and returns a JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function userRegisterController(req, res, next) {
    try {
        const datas = req.body.datas;

        // Hash the password
        const hashedPassword = await bcrypt.hash(
            datas.password,
            Number(process.env.HASH_TIME)
        );
        datas.password = hashedPassword;

        // Create a new repository instance for UserEntity
        const userRepository = new Repository(UserEntity);

        // Add the user data to the database
        const result = await userRepository.add(datas);

        if (result.data.rowCount == 0) {
            throw new Error("Cannot create user");
        }

        // Generate a JWT token
        const token = jwt.sign(
            { username: datas.username },
            process.env.JWT_SECRET_KEY
        );

        logger_info(
            `user ${datas.username} register successfull with token (${token})`
        );

        // Return the token in the response
        res.status(200).json({ token, sqlback: result.data });
    } catch (error) {
        next(error);
    }
}

/**
 * Controller function for user login.
 * It receives user credentials from the request body,
 * checks if the user exists, verifies the password,
 * and returns a JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function userLoginController(req, res, next) {
    try {
        const datas = req.body.datas;

        // Create a new repository instance for UserEntity
        const userRepository = new Repository(UserEntity);

        // Find the user in the database based on the username
        const result = await userRepository.find({
            where: [["username", "=", datas.username]]
        });

        if (result.length == 0) {
            throw new Error("Cannot find user");
        }

        const user = result.rawDatas[0];

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(
            datas.password,
            user.password
        );

        if (!isPasswordValid) {
            // Invalid password
            return res
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { username: datas.username },
            process.env.JWT_SECRET_KEY
        );

        logger_info(
            `user ${datas.username} login successfull with token (${token})`
        );

        // Return the token in the response
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    userRegisterController,
    userLoginController
};
