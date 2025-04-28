const express = require("express");
const { authUser } = require("../middleware/auth");
const User = require('../models/User');
const Connections = require("../models/Connections");

const requestRouter = express.Router();

requestRouter.post('/send/:status/:toUserId', authUser, async (req, res) => {
    try {
        const { status, toUserId } = req.params;
        const { _id: fromUserId } = req.user;

        if (!['interested', 'ignored'].includes(status))
            throw new Error('Invalid Connection Status');

        if (!toUserId)
            throw new Error('Provide User ID');

        const isUserExistById = await User.findById({ _id: toUserId });
        if (!isUserExistById) throw new Error("Invalid User");

        if (fromUserId.equals(toUserId)) throw new Error('Cannot Connect With Same User');

        const alreadyHavingConnections = await Connections.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (alreadyHavingConnections) {
            throw new Error("Already Connection Is Send");
        }

        const connections = new Connections({
            fromUserId,
            toUserId,
            status
        });

        if (!connections) throw new Error('Error While Creating Connection');

        await connections.save();

        res.status(200).json({
            message: `Successfully Connection Sent`,
            data: connections
        })
    } catch (err) {
        res.status(400).json({
            message: `Error While Sending Connection Requesr: ${err.message}`
        })
    }
});

module.exports = requestRouter;