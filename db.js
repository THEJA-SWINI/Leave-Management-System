const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2001",
    database: "leave_management_db"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL database connected successfully");
});

module.exports = db;