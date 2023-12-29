const express = require("express");
const MessageModel = require("../models/Message");

const router = express.Router();

router.get('/save-message', (req, res) => {
    res.status(200).json(req.query);
});

router.post('/save-message', async (req, res) => {
    try {
        const { message: cipher, iv } = req.body;
        
        const result = JSON.parse(commt.decrypt({ cipher, iv }));

        const {roomId, message} = result;

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

router.get('/', async (req, res) => {
    try {
        const {roomId, skip, limit} = req.query;
        let messages = [], hasNext;

        if (roomId && skip && limit) {
            const totalRecords = await MessageModel.countDocuments({roomId});
            messages = await MessageModel.find({roomId}).sort({createdAt: -1}).skip(skip).limit(limit);

            hasNext = totalRecords - skip > limit; // If there is no more records with this skip and limit properties, set hasNext to false else set hasNext to true
        } else {
            // Get each unique roomId values
            const roomIds = await MessageModel.collection.distinct('roomId');
            await Promise.all(roomIds.map(async (roomId) => {
                // Get messages for each roomId and push it into messages array - get only last limited messages
                const res = await MessageModel.find({roomId}).sort({createdAt: -1}).limit(limit || 10);
                messages.push(...res);
            }));
        }
  
        return res.json({messages, hasNext});
    } catch (err) {
        res.status(500).send(err.message);
    }
});
  
module.exports = router;