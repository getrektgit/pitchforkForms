const db = require("../config/database");

// Segédfüggvény az SQL lekérdezéshez
const dbQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

module.exports = dbQuery