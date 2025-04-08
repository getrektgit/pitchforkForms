const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pitchforkforms"
});

db.connect((err) => {
    if (err) {
        console.error("Adatbázis kapcsolat hiba:", err);
        return;
    }
    console.log("Sikeres adatbázis kapcsolat!");
});

module.exports = db;