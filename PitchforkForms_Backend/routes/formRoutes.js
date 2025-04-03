const express = require("express");
const db = require("../config/database");
const dotenv = require("dotenv");
const authenticateToken = require("../middlewares/authMiddleware");

dotenv.config();
const router = express.Router();

// Segédfüggvény az SQL lekérdezéshez
const dbQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

//GET /forms – Az alapadatok lekérése
router.get("/forms", authenticateToken, async (req, res) => {
    try {
        const forms = await dbQuery("SELECT id, name, creator_id FROM forms");
        res.json(forms);
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Szerverhiba!" });
    }
});

//POST /forms/get – Egy űrlap összes adatának lekérése
router.post("/forms/get", authenticateToken, async (req, res) => {
    const { form_id } = req.body;
    
    if (!form_id) {
        return res.status(400).json({ message: "Hiányzó form_id!" });
    }

    try {
        // az űrlap adatai
        const query = `
            SELECT 
                f.id AS form_id, f.name AS form_name, f.creator_id,
                q.id AS question_id, q.text AS question_text, q.type, q.score,
                GROUP_CONCAT(JSON_OBJECT('id', a.id, 'text', a.text, 'is_right', a.is_right)) AS answers
            FROM forms f
            LEFT JOIN questions q ON f.id = q.form_id
            LEFT JOIN answer_options a ON q.id = a.question_id
            WHERE f.id = ?
            GROUP BY q.id
        `;

        const results = await dbQuery(query, [form_id]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Nincs ilyen űrlap!" });
        }

        // Az űrlap alapadatai
        const form = {
            id: results[0].form_id,
            name: results[0].form_name,
            creator_id: results[0].creator_id,
            questions: results.map(row => ({
                id: row.question_id,
                text: row.question_text,
                type: row.type,
                score: row.score,
                answers: row.answers ? JSON.parse(`[${row.answers}]`) : []
            }))
        };

        res.json(form);
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Szerverhiba!" });
    }
});

module.exports = router;
