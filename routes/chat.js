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

        res.status(200).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/load-more-messages', async (req, res) => {
    try {
        const {roomId, offset, limit} = req.query;

        // Offset field represents "page" and help us to skip certain amount of records
        const skip = offset * limit;

        const totalRecords = await MessageModel.countDocuments({roomId});
        const messages = await MessageModel.find({roomId}).skip(skip).limit(limit);

        const hasNext = totalRecords - skip > limit; // If there is no more records with this skip and limit properties, set hasNext to false else set hasNext to true

        res.status(200).json({messages, hasNext});
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const messages = await MessageModel.find();
  
        return res.json(messages);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
  
module.exports = router;