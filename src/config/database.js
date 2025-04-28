const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://nehalarshad11:eWcQwvEtwPm7tE78@cluster0.lrg0iop.mongodb.net/devTinder')
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = connectDB;