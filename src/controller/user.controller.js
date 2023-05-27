const { Repository } = require('@src/entity/Repository')
const { UserEntity } = require('@src/entity/User.entity')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { add_controller, delete_controller, find_controller, update_controller } = require('./common.controller')
require('dotenv').config();

async function userRegister_controller(req, res, next) {
    try {
        const datas = req.body.datas;
        const hashedPassword = await bcrypt.hash(datas.password, Number(process.env.HASH_TIME));
        datas.password = hashedPassword

        const userRepository = new Repository(UserEntity)
        const result = await userRepository.add(datas)

        if (result.rowCount == 0) {
            throw new Error("cannot create user")
        }

        const token = jwt.sign({ userName: datas.userName }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ token });
    } catch (error) {
        next(error)
    }
}

async function userLogin_controller(req, res, next) {
    try {
        const datas = req.body.datas;

        const userRepository = new Repository(UserEntity)
        const result = await userRepository.find({ where: [['userName', '=', datas.userName]] })
        if(result.length == 0){
            throw new Error("cannot find user") 
        }

        const user = result.rawDatas[0]

        const isPasswordValid = await bcrypt.compare(datas.password, user.password);
        if (!isPasswordValid) {
            // Mật khẩu không đúng
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        
        // Tạo JSON Web Token (JWT)
        const token = jwt.sign({ userName: datas.userName }, process.env.JWT_SECRET_KEY);

        // Trả về kết quả và token
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function userChangePassword_controller(req, res, next) {
    try {
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = {
    userRegister_controller,
    userLogin_controller,
}