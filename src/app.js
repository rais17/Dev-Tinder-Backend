require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require('./routes/request.js');
const userRouter = require("./routes/user.js")

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://13.61.174.243'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);



connectDB()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(process.env.PORT, '0.0.0.0', () => {
            console.log("Server is successfully runs on the PORT 7777");
        });
    })
    .catch((err) => console.error("Error while conneting Database", err));
