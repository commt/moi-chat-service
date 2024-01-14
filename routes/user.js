const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  const username = req.body.username.trim();

  try {
    const user = await User.findOne({ username });

    if (user) {
      return res.json(user);
    }

    // Generate RSA keysets
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

    // Find random images from robohash for avatar
    var r = Math.random();
    const avatar = 'https://robohash.org/' + Math.floor(r * (1000 - 1) + 1) + '.png';

    // Create user with avatar and RSA keys
    const newUser = await User.create({
        username,
        privateKey,
        publicKey,
        chatAuthId: Math.random().toString(16).slice(4), // TODO: Generate it by using Commt NodeSDK
        avatar
    });

    return res.json(newUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
