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

const activeRefreshTokens = new Set();
const JWT_SECRET = process.env.SECRET_KEY || "bdhfjsgdfgdfsgdfvbdgf";

//REGISTER USER
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

//LOGIN
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

        const refreshToken = jwt.sign(
            {id:user.id,username:user.username},
            process.env.REFRESH_SECRET,
            {expiresIn:"3h"}
        )

        activeRefreshTokens.add(refreshToken)
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"Strict",
            maxAge: 3 * 60 * 60 * 1000,
        })
        res.json({ message: "Sikeres bejelentkezés!", token });
    });
});


//LIST ALL USERS
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

//PROTECTED ROUTE (ADMIN ONLY)
router.get("/me", authenticateToken, /*isAdmin,*/ (req,res)=>{
    res.json({message:"Welcome admin!",user:req.user})
})


//NEW ACCESS TOKEN
router.post("/refresh",(req,res)=>{
    const oldRefreshToken = req.cookies.refreshToken
    if(!oldRefreshToken)
        return res.status(401).json({error:"No refresh token provided!"})


    if(!activeRefreshTokens.has(oldRefreshToken))
        return res.status(403).json({error:"Token has been already used or expired!"})

    jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET,(err,user)=>{
        if(err)
            return res.status(403).json({error:"Invalid or expired refresh token!"})

        activeRefreshTokens.delete(oldRefreshToken)

        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        const newRefreshToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
          );

          activeRefreshTokens.add(newRefreshToken)
          res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
          res.json({token:newAccessToken})
    })
})


//LOGOUT (IF NEEDED)
router.post("/logout",(req,res)=>{
    const refreshToken = req.cookies.refreshToken
    if(refreshToken) activeRefreshTokens.delete(refreshToken)

    res.clearCookie("refreshToken")
    res.json({message:"Logged out successfully!"})
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

        const result = await db.execute(sql, values);

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
router.delete("/users/:id",authenticateToken,isAdmin,  async (req, res) => {
    const userId = req.params.id;

    try {
        const sql = "DELETE FROM users WHERE id = ?";
        const result = await db.execute(sql, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Felhasználó nem található!" });
        }

        res.json({ message: "Felhasználó sikeresen törölve!" });
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ message: "Szerverhiba!", error: error.sqlMessage });
    }
});
module.exports = router;