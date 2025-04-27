const express = require("express")
const dotenv = require("dotenv")
const authenticateToken = require("../middlewares/authMiddleware")
const isAdmin = require("../middlewares/roleCheckMiddleware")
const dbQuery = require("../utils/queryHelper")

dotenv.config()

const router = express.Router()


//LIST ALL USERS EXCEPT ADMINS
router.get("/users", authenticateToken, isAdmin, async (req, res) => {
    const sql_query = "SELECT email, username, role, id, profile_pic FROM users WHERE role != 'admin'";
    try {
        const results = await dbQuery(sql_query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Szerverhiba!" });
    }
});

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
            SELECT 
                f.id AS form_id, 
                f.name, 
                f.creator_id, 
                f.sent_out, 
                s.submit_time, 
                s.total_score,
                COALESCE(qs.max_score, 0) AS max_score
            FROM submissions s
            JOIN forms f ON s.form_id = f.id
            LEFT JOIN (
                SELECT form_id, SUM(score) AS max_score
                FROM questions
                GROUP BY form_id
            ) qs ON f.id = qs.form_id
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

// GET COMPLETED FORM DETAILS FOR USER (with answers)
router.get("/form/completed/:formId/user/:userId", authenticateToken, async (req, res) => {
    const { formId, userId } = req.params;

    if (!formId || !userId) {
        return res.status(400).json({ message: "Missing form ID or user ID" });
    }

    try {
        // Fetch form questions with their answer options
        const formDetailsQuery = `
            SELECT q.id AS question_id, q.text AS question_text, 
                ao.id AS answer_option_id, ao.text AS answer_option_text,
                ao.is_right AS is_right_answer,
                EXISTS (
                    SELECT 1 
                    FROM submission_answers sa
                    WHERE sa.submission_id = s.id AND sa.answer_id = ao.id
                ) AS is_answer_selected
            FROM questions q
            JOIN answer_options ao ON q.id = ao.question_id
            JOIN submissions s ON s.form_id = q.form_id
            WHERE q.form_id = ? AND s.user_id = ?
        `;

        // Fetch the form submission data
        const completedFormDetails = await dbQuery(formDetailsQuery, [formId, userId]);

        // If no form found for the user, return a 404
        if (completedFormDetails.length === 0) {
            return res.status(404).json({ message: "No completed form found for this user" });
        }

        // Process the result to structure the response
        const questions = [];
        completedFormDetails.forEach((row) => {
            let question = questions.find((q) => q.question_id === row.question_id);

            if (!question) {
                question = {
                    question_id: row.question_id,
                    question_text: row.question_text,
                    answer_options: [],
                };
                questions.push(question);
            }

            question.answer_options.push({
                answer_option_id: row.answer_option_id,
                answer_option_text: row.answer_option_text,
                is_right_answer: row.is_right_answer,
                is_answer_selected: row.is_answer_selected,
            });
        });

        // Respond with the structured data
        res.json({ formDetails: questions });
    } catch (error) {
        console.error("Error fetching form details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});




module.exports = router