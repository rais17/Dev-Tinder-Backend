const express = require("express");
const { authUser } = require("../middleware/auth");
const { validateRequest, validatePasswordRequest } = require("../utils/validations");
const { PROFILE_UPDATE_ALLOWED_VALUE, CHANGE_PASSWORD_ALLOWED_VALUE } = require("../utils/constant")
const User = require("../models/User");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get('/', authUser, async (req, res) => {
    try {

        const authenticatedUser = req.user;
        res.send(authenticatedUser);

    } catch (err) {
        res.status(400).json({
            message: `Error While Getting Profile: ${err.message}`,
        })
    }
});

profileRouter.patch('/update', authUser, async (req, res) => {
    try {

        const requestObject = req.body
        validateRequest(requestObject, PROFILE_UPDATE_ALLOWED_VALUE);
        
        const userTobeUpdate = req.user;
        Object.keys(req.body).forEach(key => userTobeUpdate[key] = requestObject[key]);

        await userTobeUpdate.save();

        res.send("Profile Updated")
    } catch (err) {
        res.status(400).json({
            message: `Error While Updating Profile: ${err.message}`,
        })
    }
})

profileRouter.patch('/password', async (req, res) => {
    try {
        
        const requestObject = req.body;
        validatePasswordRequest(requestObject, CHANGE_PASSWORD_ALLOWED_VALUE);

        const { email, password, changePassword } = requestObject;
        const isUserExistByEmail = await User.findOne({ email: email });
        if (!isUserExistByEmail) throw new Error("User Not Found");

        await isUserExistByEmail.verifyPassword(password);
        const changePasswordHash = await bcrypt.hash(changePassword, 10);
        if (!changePasswordHash) throw new Error("Error While Creating Password");

        if (!validator.isStrongPassword(changePassword)) throw new Error("Password Is Weak");

        isUserExistByEmail.password = changePasswordHash;
        await isUserExistByEmail.save();

        res.status(200).json({
            message: `Password Updated`
        })

    } catch(err) {
        res.status(400).json({
            message: `Error While Updating Profile: ${err.message}`,
        })
    }
})

module.exports = profileRouter;