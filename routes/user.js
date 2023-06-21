const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

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

    const newUser = await User.create({
        username,
        privateKey,
        publicKey
    });

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
