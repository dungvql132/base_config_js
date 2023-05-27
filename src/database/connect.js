require('dotenv').config();

function getQueryPromise(query) {
    return client.query(query)
}
// Xuất kết nối đến PostgreSQL như một module

// getQueryPromise(`Select * from users;`).then(data=>{
//     console.log(data);
// })

const { Client } = require('pg');

// Tạo client kết nối đến cơ sở dữ liệu
const client = new Client({
    user: process.env.PG_USER, // Tên người dùng của PostgreSQL
    host: process.env.PG_HOST, // Địa chỉ máy chủ PostgreSQL
    database: process.env.PG_DATABASE, // Tên cơ sở dữ liệu
    password: process.env.PG_PASSWORD, // Mật khẩu của PostgreSQL
    port: process.env.PG_PORT // Cổng mặc định của PostgreSQL
});

module.exports = {
    getQueryPromise,
    client
};