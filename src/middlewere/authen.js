require('dotenv').config();
const jwt = require('jsonwebtoken');

async function checkToken_middlewere(req, res, next) {
    try {
        // Lấy token từ header
        const token = req.headers.authorization;
    
        if (!token) {
          // Token không tồn tại
          return res.status(401).json({ success: false, message: 'Token not found' });
        }
    
        // Xác thực và giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
        // Lưu thông tin người dùng vào req.body.user
        req.body.user = decoded;
    
        // Chuyển sang middleware hoặc route tiếp theo
        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid token' });
      }
}

module.exports = {
    checkToken_middlewere
}