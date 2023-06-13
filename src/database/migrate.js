const { client } = require("./connect");

const fs = require("fs");

// Path to the file to be read
const filePath = "./src/database/demo.sql";

// Read the file
fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    client
        .connect()
        .then(() => {
            console.log("Connected to PostgreSQL database");
            // Perform queries here
        })
        .catch(err => {
            console.error("Error connecting to PostgreSQL database:", err);
        });

    await client.query(data);
    console.log("Migrate Database success");
    client.end();
});
