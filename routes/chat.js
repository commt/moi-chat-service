const express = require("express");
const MessageModel = require("../models/Message");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const messages = await MessageModel.find();
  
        return res.json(messages);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/save-message', async (req, res) => {
    try {
        const {roomId, message} = req.body;

        console.log('--- body--->>', req.body);

        const newMessage = await MessageModel.create({
            roomId,
            type: message.type,
            senderId: message.user._id,
            createdAt: message.createdAt,
            message: message.text,
        });

        console.log('--- newMessage--->>', newMessage);
        
        res.status(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
  
module.exports = router;