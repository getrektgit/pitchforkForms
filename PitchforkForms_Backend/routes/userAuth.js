const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const db = require("../config/database");
const authenticateToken = require("../middlewares/authMiddleware")
const isAdmin = require("../middlewares/roleCheckMiddleware")

dotenv.config()

const router = express.Router();
router.use(cookieParser());


const JWT_SECRET = process.env.SECRET_KEY || "bdhfjsgdfgdfsgdfvbdgf";


router.post("/register", async (req, res) => {
    const { email, username, password, profile_pic } = req.body;

    if (!email || !username || !password || !profile_pic) {
        return res.status(400).json({ message: "Minden mező kötelező!" });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const role = "student"
        const sql = "INSERT INTO users (email, username, role, password_hash, profile_pic) VALUES (?, ?, ?, ?, ?)";

        db.query(sql, [email, username, role, passwordHash, profile_pic], (err, result) => {
            if (err) {
                console.error("SQL Error:", err);
                return res.status(500).json({ message: "Szerverhiba!", error: err.sqlMessage });
            }
            res.status(201).json({ message: "Sikeres regisztráció!" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hiba történt a regisztráció során!" });
    }
});


router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Adj meg emailt és jelszót!" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ message: "Szerverhiba!" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Hibás email vagy jelszó!" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Hibás email vagy jelszó!" });
        }

        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Sikeres bejelentkezés!", token });
    });
});

router.get("/users",(req,res)=>{
    const sql_query = "SELECT id, email, username, role, profile_pic FROM users"
    db.query(sql_query, async(err,results)=>{
        if(err){
            console.error("SQL error:",err)
            res.status(500).json({message:"Szerverhiba!"})
        }
        if(results.length === 0){
            return res.status(401).json({ message: "Nincs felhasználó a rendszerben!" });
        }
        res.json(results)
    })
})

router.get("/me", authenticateToken, isAdmin, (req,res)=>{
    res.json({message:"Welcome admin!",user:req.user})
})
module.exports = router;