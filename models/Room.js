const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: String,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    communityAvatar: String,
    communityName: String,
    maxCommunityParticipants: {
      type: Number,
      default: 60,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
