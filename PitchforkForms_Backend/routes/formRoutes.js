const express = require("express")
const db = require("../config/database")
const dotenv = require("dotenv")
const authenticateToken = require("../middlewares/authMiddleware")

dotenv.config()
const router = express.Router()


router.get("/forms", authenticateToken, (req, res) => {
    db.query("SELECT * FROM forms", (err, forms) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ message: "Szerverhiba!" });
        }

        const formsWithQuestions = [];
        let formsRemaining = forms.length;

        forms.forEach(form => {
            db.query("SELECT * FROM questions WHERE form_id = ?", [form.id], (err, questions) => {
                if (err) {
                    console.error("SQL Error:", err);
                    return res.status(500).json({ message: "Szerverhiba!" });
                }

                const questionsWithAnswers = [];
                let questionsRemaining = questions.length;

                questions.forEach(question => {
                    db.query("SELECT * FROM answer_options WHERE question_id = ?", [question.id], (err, answers) => {
                        if (err) {
                            console.error("SQL Error:", err);
                            return res.status(500).json({ message: "Szerverhiba!" });
                        }

                        questionsWithAnswers.push({
                            ...question,
                            answers: answers
                        });

                        questionsRemaining--;
                        if (questionsRemaining === 0) {
                            formsWithQuestions.push({
                                ...form,
                                questions: questionsWithAnswers
                            });

                            formsRemaining--;
                            if (formsRemaining === 0) {
                                res.json(formsWithQuestions);
                            }
                        }
                    });
                });
            });
        });
    });
});

router.post("/save-form", authenticateToken, (req, res) => {
    const { name, creator_id, questions } = req.body;

    if (!name || !creator_id || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Hiányzó adatok vagy hibás formátum!" });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Transaction Error:", err);
            return res.status(500).json({ message: "Szerverhiba!" });
        }

        db.query("INSERT INTO forms (name, creator_id) VALUES (?, ?)", [name, creator_id], (err, formResult) => {
            if (err) {
                return db.rollback(() => {
                    console.error("SQL Error:", err);
                    res.status(500).json({ message: "Szerverhiba!", error: err.message });
                });
            }
            const formId = formResult.insertId;

            let queriesRemaining = questions.length;
            questions.forEach(question => {
                const { text, type, score, answers } = question;

                db.query("INSERT INTO questions (text, type, form_id, score) VALUES (?, ?, ?, ?)",
                    [text, type, formId, score], (err, questionResult) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("SQL Error:", err);
                                res.status(500).json({ message: "Szerverhiba!", error: err.message });
                            });
                        }
                        const questionId = questionResult.insertId;

                        let answerQueriesRemaining = answers.length;
                        answers.forEach(answer => {
                            const { text, is_right } = answer;
                            db.query("INSERT INTO answer_options (question_id, text, is_right) VALUES (?, ?, ?)",
                                [questionId, text, is_right], (err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error("SQL Error:", err);
                                            res.status(500).json({ message: "Szerverhiba!", error: err.message });
                                        });
                                    }
                                    answerQueriesRemaining--;
                                    if (answerQueriesRemaining === 0) {
                                        queriesRemaining--;
                                        if (queriesRemaining === 0) {
                                            db.commit(err => {
                                                if (err) {
                                                    return db.rollback(() => {
                                                        console.error("Transaction Commit Error:", err);
                                                        res.status(500).json({ message: "Szerverhiba!" });
                                                    });
                                                }
                                                res.status(201).json({ message: "Form sikeresen létrehozva!", formId });
                                            });
                                        }
                                    }
                                });
                        });
                    });
            });
        });
    });
});

module.exports = router