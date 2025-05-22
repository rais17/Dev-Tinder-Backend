const express = require("express");
const { authUser } = require("../middleware/auth");
const Connections = require("../models/Connections");
const Chat = require("../models/Chat");

const chatRouter = express.Router();

chatRouter.get('/:toUserId', authUser, async (req, res) => {
    try {

        const { _id } = req.user;    
        const { toUserId } = req.params;
        const { count = 1 } = req.query;
        if (!_id || !toUserId) throw new Error('Unauthorize Request');

        const connectionExist = await Connections.findOne({
            status: "accepted",
            $or: [
                { fromUserId: _id, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: _id }
            ]
        });

        if (!connectionExist) throw new Error("Connection Not Exist");

        const limit = 50
        const skip = (count - 1) * limit;


        const chat = await Chat.findOne({
            participants: { $all: [_id, toUserId] }
        }).populate("messages.senderId", "firstName lastName photoUrl");

        const reversed = [...chat.messages].reverse();
        const messages = reversed.slice(skip, skip + limit).reverse();
        

        res.status(200).json({
            message: "Success",
            length: messages.length,
            response: {
                messages: messages || []
            }
        })

    } catch (err) {
        res.status(400).json({
            message: `${err.message}`
        })
       }
})

module.exports = chatRouter;