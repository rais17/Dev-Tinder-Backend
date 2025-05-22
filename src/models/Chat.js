const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String
    }
    },
    {timestamps: true});

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: 1
    }],
    messages: [messageSchema]
}, {timestamps: true});

module.exports = mongoose.model("Chat", chatSchema);