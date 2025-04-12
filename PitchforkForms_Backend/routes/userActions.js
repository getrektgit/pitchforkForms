const express = require("express")
const dotenv = require("dotenv")
const authenticateToken = require("../middlewares/authMiddleware")
const isAdmin = require("../middlewares/roleCheckMiddleware")
const dbQuery = require("../utils/queryHelper")

dotenv.config()

const router = express.Router()


//LIST ALL USERS
router.get("/users",authenticateToken, isAdmin ,async (req, res) => {
    const sql_query = "SELECT id, email, username, role, profile_pic FROM users"
    try {
        const results = await dbQuery(sql_query)
        res.json(results)
    } catch (error) {
        res.status(500).json({message:"Szerverhiba!"})
    }
})

//GET USER BY ID
router.get("/userbyid/:id", (req, res) => {
    const userId = req.params.id;
    const sql_query = "SELECT id, email, username, role, profile_pic FROM users WHERE id = " + userId

    const results = dbQuery(sql_query)
    if (results.length === 0) {
        return res.status(401).json({ message: "Nincs felhasználó a rendszerben!" });
    }
    res.json(results)
})

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
router.delete("/users/:id", authenticateToken, isAdmin, async (req, res) => {
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

module.exports = router