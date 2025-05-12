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
            message: `Success`,
            response: connections
        })

    } catch (err) {
        res.status(400).json({
            message: `${err.message}`
        })
    }
});

requestRouter.post('/review/:status/:requestId', authUser, async (req, res) => {
    try {

        const { status, requestId } = req.params;
        const loggedUser = req.user;

        if (!['rejected', 'accepted'].includes(status)) {
            throw new Error('Status Is Invalid');
        }

        if (!requestId)
            throw new Error("Invalid Request Id");

        const connection = await Connections.findOne({
            _id: requestId,
            toUserId: loggedUser._id,
            status: 'interested',
        });

        if (!connection) {
            return res.status(404).json({message: 'No Connection Found'})
        };

        connection.status = status;


        const data = await connection.save();

        res.status(200).json({
            message: `${status} Successfully`,
            response: data
        })

    } catch (err) {
        res.status(400).json({
            message: `Error While ${req.params.status} Connection`,
        })
    }
})

module.exports = requestRouter;