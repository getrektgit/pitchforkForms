const express = require("express")
const dotenv = require("dotenv")
const authenticateToken = require("../middlewares/authMiddleware")
const isAdmin = require("../middlewares/roleCheckMiddleware")
const dbQuery = require("../utils/queryHelper")

dotenv.config()

const router = express.Router()


//LIST ALL USERS EXCEPT ADMINS
router.get("/users", authenticateToken, isAdmin, async (req, res) => {
    const sql_query = "SELECT email, username, role, profile_pic FROM users WHERE role != 'admin'"
    try {
        const results = await dbQuery(sql_query)
        res.json(results)
    } catch (error) {
        res.status(500).json({ message: "Szerverhiba!" })
    }
})

//GET USER BY ID
router.get("/userbyid/:id", authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const sql = "SELECT id, email, username, role, profile_pic FROM users WHERE id = ?";
        const results = await dbQuery(sql, [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Nincs ilyen felhasználó!" });
        }

        res.json(results[0]);
    } catch (err) {
        console.error("DB hiba:", err);
        res.status(500).json({ message: "Szerverhiba." });
    }
});

//UPDATE USER
router.put("/users/:id", authenticateToken, async (req, res) => {
    const userId = req.params.id;
    const { email, username, profile_pic } = req.body;

    if (!email || !username) {
        return res.status(400).json({ message: "Email és felhasználónév megadása kötelező!" });
    }

    try {
        const sql = "UPDATE users SET email = ?, username = ?, profile_pic = ? WHERE id = ?";
        const values = [email, username, profile_pic || null, userId];

        const result = await dbQuery(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Felhasználó nem található!" });
        }

        res.json({ message: "Felhasználói adatok sikeresen frissítve!" });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Szerverhiba!", error: error.sqlMessage });
    }
});

//DELETE USER
router.delete("/users/:id", authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const sql = "DELETE FROM users WHERE id = ?";
        const result = await dbQuery(sql, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Felhasználó nem található!" });
        }

        res.json({ message: "Felhasználó sikeresen törölve!" });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Szerverhiba!", error: error.sqlMessage });
    }
});

// GET INCOMPLETE FORMS FOR USER
router.get("/pending/:userId", authenticateToken, async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: "Hiányzó user ID!" });
    }

    try {
        const pendingForms = await dbQuery(
            `
            SELECT f.id, f.name, f.creator_id
            FROM sent_forms sf
            JOIN forms f ON sf.form_id = f.id
            WHERE sf.user_id = ?
            AND f.id NOT IN (
                SELECT form_id FROM submissions WHERE user_id = ?
            )
            `,
            [userId, userId]
        );

        res.json({ forms: pendingForms });
    } catch (error) {
        console.error("Hiba a függő űrlapok lekérdezésekor:", error);
        res.status(500).json({ message: "Szerverhiba!", error: error.message });
    }
});

// GET COMPLETED FORMS FOR USER
router.get("/forms/completed/:userId", authenticateToken, async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: "Hiányzó user ID!" });
    }

    try {
        const completedForms = await dbQuery(
            `
            SELECT f.id, f.name, f.creator_id, f.sent_out, s.submit_time, s.total_score
            FROM submissions s
            JOIN forms f ON s.form_id = f.id
            WHERE s.user_id = ?
            `,
            [userId]
        );

        res.json({ forms: completedForms });
    } catch (error) {
        console.error("Hiba a kitöltött űrlapok lekérdezésekor:", error);
        res.status(500).json({ message: "Szerverhiba!", error: error.message });
    }
});


module.exports = router