const express = require("express");
const MessageModel = require("../models/Message");

const router = express.Router();

router.post('/save-message', async (req, res) => {
    try {
        const {roomId, message} = req.body;

        await MessageModel.create({
            roomId,
            type: message.type,
            senderId: message.senderId,
            createdAt: message.createdAt,
            message: message.text,
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const {roomId, offset, limit} = req.query;
        let messages, hasNext;

        if (roomId && offset && limit) {
            // Offset field represents "page" and help us to skip certain amount of records
            const skip = offset * limit;

            const totalRecords = await MessageModel.countDocuments({roomId});
            messages = await MessageModel.find({roomId}).skip(skip).limit(limit);

            hasNext = totalRecords - skip > limit; // If there is no more records with this skip and limit properties, set hasNext to false else set hasNext to true
        } else {
            messages = await MessageModel.find().sort({createdAt: -1}).limit(limit || 10);
        }
  
        return res.json({messages, hasNext});
    } catch (err) {
        res.status(500).send(err.message);
    }
});
  
module.exports = router;