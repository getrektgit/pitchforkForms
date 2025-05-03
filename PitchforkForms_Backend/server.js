const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv")
const userAuth = require("./routes/userAuth")
const cookieParser  = require("cookie-parser")
const formRoutes = require("./routes/formRoutes")
const userActions = require("./routes/userActions")
dotenv.config()
const app = express()

app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PATH','PUT','DELETE','OPTIONS','HEAD'],
    allowedHeaders:['Content-Type','Authorization'],
    exposedHeaders:['Content-Length','X-Total-Count'],
    credentials:true,
    preflightContinue:false,
    optionSuccessStatus:204
}))

app.use(express.json())
app.use(cookieParser())

app.use('/auth',userAuth)
app.use('/form',formRoutes)
app.use('/user',userActions)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));