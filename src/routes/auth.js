const express = require("express");
const { validateRequest } = require("../utils/validations");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { USER_ALLOWED_VALUE, REQUIRED_FIELDS } = require("../utils/constant");


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        const userObj = req.body;

        validateRequest(userObj, USER_ALLOWED_VALUE, REQUIRED_FIELDS, true);
        const { password } = userObj;

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({...userObj, password: hashPassword}); // Creating new instance of User model

        await user.save();
        res.send("Signup Successfully");
    } catch (err) {
        res.status(400).json({
            message: `Error While Signup: ${err.message}`,
        })
    }
})

authRouter.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password)
            throw new Error("Invalid Credential");

        const isExistingUser = await User.findOne({ email: email });
        if (!isExistingUser) throw new Error("No Existing User With This Credential");

        await isExistingUser.verifyPassword(password)

        const token = isExistingUser.getJWTToken();

        res.cookie("token", token);
        res.send("Login Successfully");

    } catch (err) {
        res.status(400).json({
            message: `Error While Login: ${err.message}`,
        })
    }
})

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })
            .send("Logout Successfully");
    } catch (err) {
        res.status(400).json({
            message: `Error While Logout: ${err.message}`,
        })
    }
})

module.exports = authRouter;