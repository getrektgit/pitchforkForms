const express = require("express");
const db = require("../config/database");
const dotenv = require("dotenv");
const authenticateToken = require("../middlewares/authMiddleware");
const dbQuery = require("../utils/queryHelper")

dotenv.config();
const router = express.Router();



//GET /get-basic-info – Az alapadatok lekérése
router.get("/get-basic-info", authenticateToken, async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "Nincs megadva felhasználói ID." });
    }
    try {
        const forms = await dbQuery("SELECT id, name, creator_id FROM forms WHERE creator_id = ?",[userId]);
        res.json(forms);
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Szerverhiba!" });
    }
});

//POST /get-all – Egy űrlap összes adatának lekérése
router.post("/get-all", authenticateToken, async (req, res) => {
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

router.post("/save-forms", authenticateToken, async (req, res) => {
    const { name, questions } = req.body;

    if (!name || !req.user.id || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Hiányzó vagy hibás adatok!" });
    }

    db.beginTransaction(async (err) => {
        if (err) {
            console.error("Tranzakciós hiba:", err);
            return res.status(500).json({ message: "Szerverhiba!" });
        }

        try {
            const formResult = await dbQuery("INSERT INTO forms (name, creator_id) VALUES (?, ?)", [name, req.user.id]);
            const formId = formResult.insertId;

            for (const question of questions) {
                const { text, type, score, answers } = question;

                const questionResult = await dbQuery(
                    "INSERT INTO questions (text, type, form_id, score) VALUES (?, ?, ?, ?)",
                    [text, type, formId, score]
                );
                const questionId = questionResult.insertId;

                for (const answer of answers) {
                    const { text, is_right } = answer;
                    await dbQuery(
                        "INSERT INTO answer_options (question_id, text, is_right) VALUES (?, ?, ?)",
                        [questionId, text, is_right]
                    );
                }
            }

            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Commit hiba:", err);
                        res.status(500).json({ message: "Szerverhiba!" });
                    });
                }
                res.status(201).json({ message: "Űrlap sikeresen létrehozva!", formId });
            });
        } catch (error) {
            db.rollback(() => {
                console.error("SQL Hiba:", error);
                res.status(500).json({ message: "Szerverhiba!", error: error.message });
            });
        }
    });
});

router.put("/update-form/:id", authenticateToken, async (req, res) => {
    const formId = req.params.id;
    const { name, questions } = req.body;

    if (!name || !req.user.id || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Hiányzó vagy hibás adatok!" });
    }

    db.beginTransaction(async (err) => {
        if (err) {
            console.error("Tranzakciós hiba:", err);
            return res.status(500).json({ message: "Szerverhiba!" });
        }

        try {
            // Form név frissítése
            await dbQuery("UPDATE forms SET name = ? WHERE id = ? AND creator_id = ?", [name, formId, req.user.id]);

            for (const question of questions) {
                const { id: questionId, text, type, score, answers } = question;

                let currentQuestionId = questionId;

                if (currentQuestionId) {
                    // Kérdés frissítése
                    await dbQuery(
                        "UPDATE questions SET text = ?, type = ?, score = ? WHERE id = ? AND form_id = ?",
                        [text, type, score, currentQuestionId, formId]
                    );

                    // Régi válaszok törlése
                    await dbQuery("DELETE FROM answer_options WHERE question_id = ?", [currentQuestionId]);
                } else {
                    // Új kérdés létrehozása
                    const questionResult = await dbQuery(
                        "INSERT INTO questions (text, type, form_id, score) VALUES (?, ?, ?, ?)",
                        [text, type, formId, score]
                    );
                    currentQuestionId = questionResult.insertId;
                }

                // Új válaszok beszúrása
                for (const answer of answers) {
                    const { text, is_right } = answer;
                    await dbQuery(
                        "INSERT INTO answer_options (question_id, text, is_right) VALUES (?, ?, ?)",
                        [currentQuestionId, text, is_right]
                    );
                }
            }

            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Commit hiba:", err);
                        res.status(500).json({ message: "Szerverhiba!" });
                    });
                }
                res.status(200).json({ message: "Űrlap sikeresen frissítve!" });
            });
        } catch (error) {
            db.rollback(() => {
                console.error("SQL Hiba:", error);
                res.status(500).json({ message: "Szerverhiba!", error: error.message });
            });
        }
    });
});

router.post("/forms/evaluate", authenticateToken, async (req, res) => {
    const { form_id, submission_id } = req.body;

    if (!form_id || !submission_id) {
        return res.status(400).json({ message: "Hiányzó adatok!" });
    }

    try {
        let totalScore = 0;
        let userScore = 0;

        const questions = await dbQuery("SELECT id, score FROM questions WHERE form_id = ?", [form_id]);

        for (const question of questions) {
            const { id: questionId, score } = question;
            totalScore += score;

            const correctAnswers = await dbQuery(
                "SELECT id FROM answer_options WHERE question_id = ? AND is_right = 1",
                [questionId]
            );
            const correctIds = correctAnswers.map(ans => Number(ans.id)).sort((a, b) => a - b);

            const userAnswers = await dbQuery(
                `SELECT sa.answer_id
                 FROM submission_answers sa
                 JOIN answer_options ao ON sa.answer_id = ao.id
                 WHERE sa.submission_id = ? AND ao.question_id = ?`,
                [submission_id, questionId]
            );
            const userAnswerIds = userAnswers.map(a => Number(a.answer_id)).sort((a, b) => a - b);
            console.log("Kérdés ID:", questionId);
            console.log("Helyes válaszok:", correctIds);
            console.log("Beküldött válaszok:", userAnswerIds);
            const isCorrect = JSON.stringify(correctIds) === JSON.stringify(userAnswerIds);
            if (isCorrect) {
                userScore += score;
            }
        }

        res.json({ message: "Értékelés kész!", score: userScore, maxScore: totalScore });
    } catch (error) {
        console.error("Értékelési hiba:", error);
        res.status(500).json({ message: "Hiba az értékelés során!", error: error.message });
    }
});

router.post("/forms/save-answers", authenticateToken, async (req, res) => {
    const { form_id, user_id, answers } = req.body;

    if (!form_id || !user_id || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Hiányzó vagy hibás adatok!" });
    }

    db.beginTransaction(async (err) => {
        if (err) {
            console.error("Tranzakciós hiba:", err);
            return res.status(500).json({ message: "Szerverhiba!" });
        }

        try {
            const submissionResult = await dbQuery(
                "INSERT INTO submissions (user_id, form_id, submit_time) VALUES (?, ?, NOW())",
                [user_id, form_id]
            );
            const submissionId = submissionResult.insertId;

            for (const answer of answers) {
                await dbQuery(
                    "INSERT INTO submission_answers (submission_id, answer_id) VALUES (?, ?)",
                    [submissionId, answer.answer_id]
                );
            }

            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Commit hiba:", err);
                        res.status(500).json({ message: "Szerverhiba a mentés során!" });
                    });
                }

                res.status(201).json({ message: "Válaszok sikeresen elmentve!", submissionId });
            });

        } catch (error) {
            db.rollback(() => {
                console.error("Mentési hiba:", error);
                res.status(500).json({ message: "Hiba a válaszok mentése során!", error: error.message });
            });
        }
    });
});
module.exports = router;
