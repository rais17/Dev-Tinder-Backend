const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        status: {
            type: String,
            require: true,
            enum: {
                values: ["interested", "ignored", "accepted", "rejected"],
                message: "Invalid Status `{VALUE}`",
            },
        },
    },
    {
        timestamps: true,
    }
);

// Giving Index to fromUserId and toUserId field
connectionSchema.index({ fromUserId: 1, toUserId: 1 })

//execute the callback before saving the connections model instance (pre is middleware)
// connectionSchema.pre("save", function () {

// })

// connectionSchema.post("save", function () {

// })

module.exports = mongoose.model("Connections", connectionSchema);
