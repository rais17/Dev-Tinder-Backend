const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Connections = require("../models/Connections");
const Chat = require("../models/Chat");

function initializeSocketConnection(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.use(async (socket, next) => {
        try {

            if (!socket.handshake.auth || !socket.handshake.auth.token)
                throw new Error("Unauthorized Request");

            const decodedToken = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
            if (!decodedToken) throw new Error("Token Verification Fails");

            const { _id } = decodedToken;
            if (!_id) throw new Error("No Data In Token");

            const isUserExist = await User.findOne({ _id: _id });
            if (!isUserExist) throw new Error("Invalid Credential");

            socket.user = isUserExist;
            next();
        } catch (err) {
            next(new Error(`Authentication failed: ${err.message}`));
        }
    })
    io.on("connection", async (socket) => {
        socket.on("join_chat", async ({ toUserId }) => {
            try {
                const { _id } = socket.user
                if (!toUserId || !_id) throw new Error("Invalid ID");

                const connection = await Connections.findOne({
                    $or: [
                        { fromUserId: _id, toUserId: toUserId, status: "accepted" },
                        { fromUserId: toUserId, toUserId: _id, status: "accepted" },
                    ],
                });

                if (!connection) throw new Error("Connection Not Exist");
                const room = [_id, toUserId].sort().join("_");
                socket.join(room);

            } catch (err) {
                socket.emit('error', `Connection failed: ${err?.message}`);
            }
        });

        socket.on("send_message", async ({ toUserId, message }) => {
            try {
                const { _id } = socket.user;

                if (!toUserId || !_id) throw new Error("Invalid ID");
                if (!message) throw new Error('Empty Message');

                const sortedParticipants = [_id, toUserId].sort((a, b) => a.toString().localeCompare(b.toString()));
                const chat = await Chat.findOneAndUpdate(
                    { participants: sortedParticipants },
                    {
                        $push: { messages: { senderId: _id, message } },
                        $setOnInsert: { createdAt: new Date() }
                    },
                    { upsert: true, new: true }
                ).populate('messages.senderId', 'firstName lastName photoUrl');
                
                if (!chat) throw new Error("Server Error");
                await chat.save();

                const latestMessage = chat?.messages[chat?.messages?.length - 1];

                const response = {
                    _id: latestMessage?._id,
                    senderId: latestMessage?.senderId,
                    message: message,
                    createdAt: latestMessage?.createdAt,
                    updatedAt: latestMessage?.updatedAt
                }

                const room = [_id, toUserId].sort().join("_");
                io.to(room).emit("received_message", { message: response });

            } catch (err) {
                socket.emit('error', `Message Send Fail: ${err.message}`)
            }
        });

        socket.on("disconnect", () => { });
    });
}

module.exports = initializeSocketConnection;
