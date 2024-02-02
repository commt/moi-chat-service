const express = require("express");
const RoomModel = require("../models/Room");

const router = express.Router();

// Webhook Health check route
router.get('/create-room', (req, res) => {
    res.status(200).json(req.query);
});

// Webhook URL to store the room detail in DB with data coming from Commt
router.post('/create-room', async (req, res) => {
    try {
        const { participants, communityAvatar, communityName } = req.body;

        const roomId = Math.random().toString(16).slice(8);
        const chatRoomAuthId = Math.random().toString(16).slice(4); // TODO: Generate it by using Commt NodeSDK

        const room = await RoomModel.findOne({participants});

        if (room) return res.json(room); // If the room exists with given participants return that one

        // Create a new room and return it
        const newRoom = await RoomModel.create({
            roomId,
            chatRoomAuthId,
            participants,
            ...(communityAvatar && communityName && { communityAvatar, communityName})
        });

        return res.json(newRoom);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all rooms
router.get('/', async (req, res) => {
    const { userId } = req.query;
    try {
        const rooms = await RoomModel.find({ participants: {$in: [userId]} });

        return res.json(rooms);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
  
module.exports = router;