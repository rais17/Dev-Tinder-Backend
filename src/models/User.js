const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        immutable: true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error("Email is invalid")
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) throw new Error("Password is weak")
        }
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value))
                throw new Error("Invalid Gender Type");
        }
    },
    age: {
        type: Number,
        min: 18
    },
    phoneNumber: {
        type: String,
        validate(value) {
            if (!validator.isMobilePhone(value)) throw new Error("Phone is Invalid")
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) throw new Error("URL is Invalid")
        },
        default: "https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png"
    }
    },
    {timestamps: true}
);

userSchema.methods.verifyPassword = async function (userInputPassword) {
    try {
        const user = this
        const isValidPassword = await bcrypt.compare(userInputPassword, user.password);
        if (!isValidPassword) throw new Error("Password Invalid");
    } catch (err) {
        throw new Error(err.message);
    }
}

userSchema.methods.getJWTToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, "DEV@TINDER$123", { expiresIn: '1h' });
    if (!token) throw new Error("Error while Generating Token")
    return token;
}

module.exports = mongoose.model("User", userSchema);
