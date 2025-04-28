const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require('./routes/request.js');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);


connectDB()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(7777, () => {
            console.log("Server is successfully runs on the PORT 7777");
        });
    })
    .catch((err) => console.error("Error while conneting Database", err));
