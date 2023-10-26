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
        await MessageModel.create(req.body);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
  
module.exports = router;