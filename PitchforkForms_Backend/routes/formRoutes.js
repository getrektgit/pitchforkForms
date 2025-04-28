const express = require("express");
const db = require("../config/database");
const dotenv = require("dotenv");
const authenticateToken = require("../middlewares/authMiddleware");
const dbQuery = require("../utils/queryHelper")
const notifyUser = require("../utils/notifyUser");

dotenv.config();
const router = express.Router();

const checkSubmissions = async (forms) => {
    console.log(forms)
    let tempForms = []
    for (const index in forms) {
        const element = forms[index]
        const submissions = await dbQuery("SELECT form_id FROM submissions WHERE form_id = ?", [element.id])
        tempForms.push({ isFilledOutAtLeastOnce: !!submissions.length, ...element })
    }
    return tempForms
}

//GET /get-basic-info – Az alapadatok lekérése
router.get("/get-basic-info", authenticateToken, async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "Nincs megadva felhasználói ID." });
    }
    try {
        let forms = await dbQuery("SELECT id, name, creator_id FROM forms WHERE creator_id = ?", [userId]);
        forms = await checkSubmissions(forms);
        console.log(forms)
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

const total_Score = async (answers) => {
    let totalScore = 0;
    for (const answerId of answers) {
        const questionData = await dbQuery(`
            SELECT q.id as question_id, q.type, q.score, ao.is_right
            FROM questions q
            INNER JOIN answer_options ao ON q.id = ao.question_id
            WHERE ao.id = ?
        `, [answerId]);

        if (questionData.length === 0) continue;

        const { question_id, type, score, is_right } = questionData[0];

        if (type === 'radiobutton') {
            if (is_right) {
                totalScore += score;
            }
        } else if (type === 'checkbox') {
            if (is_right) {
                const rightCountData = await dbQuery(`
                    SELECT COUNT(*) AS right_count
                    FROM answer_options
                    WHERE question_id = ? AND is_right = TRUE
                `, [question_id]);

                const rightCount = rightCountData[0].right_count;
                if (rightCount > 0) {
                    totalScore += score / rightCount;
                }
            }
        }
    }
    return totalScore;
};

router.post("/submit", authenticateToken, async (req, res) => {
    const { form_id, user_id, answers } = req.body;

    if (!form_id || !user_id || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Hiányzó vagy hibás adatok!" });
    }
    const totalScore = await total_Score(answers)
    db.beginTransaction(async (err) => {
        if (err) {
            console.error("Tranzakciós hiba:", err);
            return res.status(500).json({ message: "Szerverhiba!" });
        }

        try {
            const submissionResult = await dbQuery(
                "INSERT INTO submissions (user_id, form_id, submit_time,total_score) VALUES (?, ?, NOW(),?)",
                [user_id, form_id, totalScore]
            );
            const submissionId = submissionResult.insertId;

            for (const answer of answers) {
                await dbQuery(
                    "INSERT INTO submission_answers (submission_id, answer_id) VALUES (?, ?)",
                    [submissionId, answer]
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

router.post("/send-to-students", authenticateToken, async (req, res) => {
    const { form_id } = req.body;

    if (!form_id) {
        return res.status(400).json({ message: "Hiányzik a form_id!" });
    }

    try {
        const form = await dbQuery("SELECT id FROM forms WHERE id = ?", [form_id]);
        if (form.length === 0) {
            return res.status(404).json({ message: "Ez a form nem létezik!" });
        }

        const students = await dbQuery("SELECT id FROM users WHERE role = 'student'");
        const now = new Date();

        for (const student of students) {
            const alreadySent = await dbQuery(
                "SELECT id FROM sent_forms WHERE user_id = ? AND form_id = ?",
                [student.id, form_id]
            );

            if (alreadySent.length === 0) {
                await dbQuery(
                    "INSERT INTO sent_forms (user_id, form_id, sent_at) VALUES (?, ?, ?)",
                    [student.id, form_id, now]
                );
            }
        }
        await notifyUser(form_id);
        res.json({
            message: `A form (ID: ${form_id}) sikeresen kiküldve ${students.length} tanulónak.`,
        });
    } catch (error) {
        console.error("Kiküldési hiba:", error);
        res.status(500).json({ message: "Hiba a kiküldés során!", error: error.message });
    }
});

router.get("/get-form/:id", authenticateToken, async (req, res) => {
    const formId = req.params.id;

    try {
        // Lekérdezzük az űrlap alapadatait
        const form = await dbQuery("SELECT * FROM forms WHERE id = ?", [formId]);

        if (form.length === 0) {
            return res.status(404).json({ message: "Nem található űrlap ezzel az ID-val!" });
        }

        // Lekérdezzük a kérdéseket
        const questions = await dbQuery("SELECT * FROM questions WHERE form_id = ?", [formId]);

        // Minden kérdéshez lekérdezzük a válaszlehetőségeket is
        for (let question of questions) {
            const answers = await dbQuery(
                "SELECT id, text FROM answer_options WHERE question_id = ?",
                [question.id]
            );
            question.answers = answers;
        }

        res.json({
            form: {
                id: form[0].id,
                name: form[0].name,
                creator_id: form[0].creator_id,
                sent_out: form[0].sent_out,
                questions: questions
            }
        });
    } catch (error) {
        console.error("Hiba az űrlap lekérdezésénél:", error);
        res.status(500).json({ message: "Szerverhiba!", error: error.message });
    }
});

router.get('/admin/students-forms/:id', async (req, res) => {
    try {
        const studentId = req.params.id; // Get the student ID from the URL parameter

        // Query to get the student details
        const studentQuery = `
            SELECT id, username, email
            FROM users
            WHERE id = ? AND role = 'student'
        `;
        const student = await dbQuery(studentQuery, [studentId]);

        if (student.length === 0) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Query to get the forms sent to the student
        const sentForms = await dbQuery(`
            SELECT sf.form_id, sf.sent_at, f.name AS form_name
            FROM sent_forms sf
            JOIN forms f ON sf.form_id = f.id
            WHERE sf.user_id = ?
        `, [studentId]);

        // Query to get the submissions made by the student
        const submissions = await dbQuery(`
            SELECT form_id, submit_time, total_score
            FROM submissions
            WHERE user_id = ?
        `, [studentId]);

        // Query to get the maximum points for each form
        const maxPointsForForms = await dbQuery(`
            SELECT q.form_id, SUM(q.score) AS max_points
            FROM questions q
            GROUP BY q.form_id
        `);

        // Map the forms sent to the student with their submission status and scores
        const formsInfo = sentForms.map(sf => {
            const submission = submissions.find(sub => sub.form_id === sf.form_id);
            const maxPoints = maxPointsForForms.find(mp => mp.form_id === sf.form_id)?.max_points || 0;

            if (submission) {
                return {
                    formName: sf.form_name,
                    status: 'completed',
                    submitTime: submission.submit_time,
                    totalScore: submission.total_score,
                    maxPoints: maxPoints,
                };
            } else {
                return {
                    formName: sf.form_name,
                    status: 'not completed',
                    message: 'Student has not filled out this form yet.',
                    maxPoints: maxPoints,
                };
            }
        });

        // Construct the response object
        const studentData = {
            id: student[0].id,
            username: student[0].username,
            email: student[0].email,
            forms: formsInfo,
        };

        res.json(studentData);

    } catch (error) {
        console.error("Error fetching student forms:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
