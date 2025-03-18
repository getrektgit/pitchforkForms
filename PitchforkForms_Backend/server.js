const express = require('express');
const db = require("./config/database")
const cors = require("cors");
const dotenv = require("dotenv")
const userAuth = require("./routes/userAuth")
const authenticateToken = require("./middlewares/authMiddleware")
const cookieParser  = require("cookie-parser")

dotenv.config()
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors());

app.use('/auth',userAuth)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));