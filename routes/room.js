const express = require("express");
const RoomModel = require("../models/Room");

const router = express.Router();

router.get('/create-room', (req, res) => {
    res.status(200).json(req.query);
});

router.get('/', async (req, res) => {
    try {
        const rooms = await RoomModel.find();
  
        return res.json(rooms);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { participants, communityAvatar, communityName } = req.body;

        const roomId = Math.random().toString(16).slice(8);
        const chatRoomAuthId = Math.random().toString(16).slice(4); // TODO: Will be update with NodeJS SDK

        const isRoomExist = await RoomModel.findOne({participants});

        if (isRoomExist) return res.json(isRoomExist);

        const newRoom = await RoomModel.create({
            roomId,
            chatRoomAuthId,
            participants,
            ...(communityAvatar && communityName && { communityAvatar, communityName})
        });

        // TODO: Create room instance on Commt with NodeJS SDK
  
        return res.json(newRoom);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
  
module.exports = router;