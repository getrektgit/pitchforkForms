const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authenticateToken = require("../middlewares/authMiddleware")
const dbQuery = require("../utils/queryHelper")

dotenv.config()

const router = express.Router();
router.use(cookieParser());

const activeRefreshTokens = new Set();
const SECRET_KEY = process.env.SECRET_KEY;

//Felhasználó regisztrálása
router.post("/register", async (req, res) => {
    const { email, username, password, profile_pic } = req.body;

    if (!email || !username || !password || !profile_pic) {
        return res.status(400).json({ message: "Minden mező kötelező!" });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const role = "student"
        const sql = "INSERT INTO users (email, username, role, password_hash, profile_pic) VALUES (?, ?, ?, ?, ?)";

        const response = await dbQuery(sql, [email, username, role, passwordHash, profile_pic])
        if (response.length === 0) {
            res.status(404).json({ message: "Hibas keres" })
        }
        else {
            res.status(201).json({ message: "Sikeres regisztracio!" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hiba történt a regisztráció során!" });
    }
});

//Bejelentkezés
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Adj meg emailt és jelszót!" });
    }

    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        const results = await dbQuery(sql, [email]);

        if (results.length === 0) {
            return res.status(400).json({ message: "Hibás email vagy jelszó!" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Hibás email vagy jelszó!" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.REFRESH_SECRET,
            { expiresIn: "3h" }
        );

        activeRefreshTokens.add(refreshToken);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 3 * 60 * 60 * 1000,
        });

        res.json({
            message: "Sikeres bejelentkezés!",
            token,
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Login hiba:", error);
        res.status(500).json({ message: "Szerverhiba!" });
    }
});

//Védett útvonal (Csak admin)
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const sql_query = "SELECT role FROM users WHERE id = ?";
        const results = await dbQuery(sql_query, [req.user.id]);

        if (results.length === 0) {
            return res.status(401).json({ message: "Nincs felhasználó a rendszerben!" });
        }

        res.json({
            message: "Welcome admin!",
            user: req.user,
            role: results[0].role
        });
    } catch (error) {
        console.error("Hiba az /auth/me endpointnál:", error);
        res.status(500).json({ message: "Szerverhiba az adatok lekérdezésekor." });
    }
});


//Új access token generálása refresh token alapján
router.post("/refresh", async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
        return res.status(401).json({ error: "No refresh token provided!" });
    }

    if (!activeRefreshTokens.has(oldRefreshToken)) {
        return res.status(403).json({ error: "Token has been already used or expired!" });
    }

    jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired refresh token!" });
        }

        activeRefreshTokens.delete(oldRefreshToken);

        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        activeRefreshTokens.add(newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        try {
            const result = await dbQuery("SELECT email, role FROM users WHERE id = ?", [user.id]);
            if (result.length === 0) {
                return res.status(401).json({ message: "Nincs felhasználó a rendszerben!" });
            }

            const { email, role } = result[0];
            res.json({
                token: newAccessToken,
                id: user.id,
                username: user.username,
                email,
                role,
            });
        } catch (error) {
            console.error("SQL error:", error);
            res.status(500).json({ message: "Szerverhiba!" });
        }
    });
});


//Kijelentkezés
router.post("/logout", (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken) activeRefreshTokens.delete(refreshToken)

    res.clearCookie("refreshToken")
    res.json({ message: "Logged out successfully!" })
})



module.exports = router;