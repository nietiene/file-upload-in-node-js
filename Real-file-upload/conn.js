const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});

connection.connect((err) => {
    if (err) console.error("Error: ", err);
    console.log("Connected");
});

module.exports = connection;