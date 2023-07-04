const UserModel = require('../models/User');

module.exports.updateUserOnline = async ({userId, socketId}) => {
    const user = await UserModel.findById(userId);

    if (user) {
        user.online = true;
        user.socketId = socketId;
        await user.save();
    }
};

module.exports.getActiveUserSocketIds = async(userIds) => {
    try {
        const socketIds = await UserModel.find({_id: {$in: userIds}});
        return socketIds;
    } catch (error) {}
};

module.exports.disconnectUser = async (socketId) => {
    try {
        const user = await UserModel.findOneAndUpdate({socketId}, {socketId: null, online: false});
        return user;
    } catch (error) {}
};