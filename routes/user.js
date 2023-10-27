const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username: username.toLowerCase().trim() });

    if (user) {
      return res.json(user);
    }

    const { publicKey, privateKey } = await crypto.generateKeyPairSync('rsa', {
        modulusLength: 1024,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
          },
    });

    var r = Math.random();
    const avatar = 'https://robohash.org/' + Math.floor(r * (1000 - 1) + 1) + '.png';

    const newUser = await User.create({
        username,
        privateKey,
        publicKey,
        chatAuthId: Math.random().toString(16).slice(4), // TODO: Will be update with NodeJS SDK
        avatar
    });
    // TODO: Create user instance on Commt with NodeJS SDK

    return res.json(newUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
