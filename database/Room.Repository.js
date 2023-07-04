const RoomModel = require("../models/Room");

module.exports.checkIfRoomExists = async (roomId) => {
  try {
    const room = await RoomModel.find({ roomId });
    return room;
  } catch (err) {}
};

module.exports.createRoom = async (roomData) => {
  try {
    const newRoom = await RoomModel.create({
        ...roomData,
        roomId: Math.random().toString(16).slice(2),
    });
    return newRoom;
  } catch (error) {}
};
