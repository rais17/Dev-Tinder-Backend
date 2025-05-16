const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION)
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = connectDB;