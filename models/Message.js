const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    roomId: String,
    message: String,
    type: String,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: Date,
  },
  { timestamps: true }
);

const Room = mongoose.model("Message", schema);

module.exports = Room;
