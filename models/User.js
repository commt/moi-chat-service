const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    privateKey: String,
    publicKey: String,
    avatar: {
      type: String,
      default: 'https://xsgames.co/randomusers/avatar.php?g=pixel'
    },
    online: Boolean,
    socketId: String,
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

module.exports = User;