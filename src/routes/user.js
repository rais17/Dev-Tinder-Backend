const express = require("express");
const { authUser } = require("../middleware/auth");
const Connections = require("../models/Connections");
const User = require("../models/User");

const userRouter = express.Router();

userRouter.get("/received/request", authUser, async (req, res) => {
  try {
    const loggedUser = req.user;

    const receivedConnections = await Connections.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "skills", "about"]).select("fromUserId");

    if (!receivedConnections)
      return res.status(404).json({ message: "No One Likes You" });

    res.status(200).json({
      message: "Success",
      response: receivedConnections,
    });
  } catch (err) {
    res.status(400).json({
      message: `${err.message}`,
    });
  }
});

userRouter.get("/connections", authUser, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connections = await Connections.find({
      $or: [
        { fromUserId: loggedUser._id, status: "accepted" },
        { toUserId: loggedUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "skills"])
      .populate("toUserId", ["firstName", "lastName", "photoUrl", "about", "skills"]);

    if (!connections)
      return res.status(404).json({ message: "No One Likes You To Connect" });

    console.log(connections)

    const filteredConnections = connections.map((connection) => {
      return connection.fromUserId._id.equals(loggedUser._id) ? connection.toUserId : connection.fromUserId;
    });

    res.status(200).json({
      message: "Success",
      response: filteredConnections,
    });
  } catch (err) {
    res.status(400).json({
      message: `${err.message}`,
    });
  }
});

userRouter.get("/feed", authUser, async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const loggedUser = req.user;
    const connections = await Connections.find({
      $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
    });
    //   .populate("fromUserId", "firstName lastName")
    //   .populate("toUserId", "firstName lastName")
    //   .select("status");

    const connectionsHideFromFeeds = new Set();
    connections.forEach((connection) => {
      connectionsHideFromFeeds.add(connection.fromUserId.toString());
      connectionsHideFromFeeds.add(connection.toUserId.toString());
    });

    const skip = (page - 1) * limit;
    limit = limit > 20 ? 20 : limit;

    const feedsUser = await User.find({
      $and: [
        { _id: { $nin: Array.from(connectionsHideFromFeeds) } },
        { _id: { $ne: loggedUser._id } },
      ],
    })
      .select("firstName lastName photoUrl about gender age skills")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: `Success`,
      response: feedsUser,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: `Error While Getting Feed: ${err.message}` });
  }
});

module.exports = userRouter;
