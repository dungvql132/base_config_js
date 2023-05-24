const { Pool } = require("pg");
require('dotenv').config();

// Cấu hình kết nối đến cơ sở dữ liệu PostgreSQL
const pool = new Pool({
    user: process.env.PG_USER, // Tên người dùng của PostgreSQL
    host: process.env.PG_HOST, // Địa chỉ máy chủ PostgreSQL
    database: process.env.PG_DATABASE, // Tên cơ sở dữ liệu
    password: process.env.PG_PASSWORD, // Mật khẩu của PostgreSQL
    port: process.env.PG_PORT // Cổng mặc định của PostgreSQL
});

function getQueryPromise(query) {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) reject(err);

            // Thực hiện truy vấn SELECT
            client.query(query, (err, data) => {
                done(); // Giải phóng kết nối
                if (err) {
                    reject(err);
                }
                if (data) {
                    resolve(data);
                }
            });
        });
    });
}
// Xuất kết nối đến PostgreSQL như một module

// getQueryPromise(`Select * from users;`).then(data=>{
//     console.log(data);
// })

module.exports = {
    getQueryPromise
};
