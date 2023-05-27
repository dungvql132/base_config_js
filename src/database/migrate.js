const { client } = require('./connect')

const fs = require('fs');

// Đường dẫn đến file cần đọc
const filePath = './src/database/demo.sql';

// Đọc file
fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    client.connect()
    .then(() => {
      console.log('Connected to PostgreSQL database');
      // Thực hiện các truy vấn tại đây
    })
    .catch((err) => {
      console.error('Error connecting to PostgreSQL database:', err);
    });

    await client.query(data)
    console.log('Migrate Database success');
    client.end();
});