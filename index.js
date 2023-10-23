const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const types = require("./utils/EmitTypes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

/*************** DB Connection ***************/
const connectDB = () => {
  mongoose
    .connect("URI", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log("Error connecting to database", err.message));
};

connectDB();
/*************** DB Connection ***************/

const userRouter = require("./routes/user");
const {
  updateUserOnline,
  getActiveUserSocketIds,
  disconnectUser,
} = require("./database/User.Repository");
const { checkIfRoomExists, createRoom } = require("./database/Room.Repository");

app.use("/user", userRouter);
app.use("/", (req, res) => res.send('Welcome!'));

const server = http.createServer(app);

server.listen(PORT, () => console.log("server running on port:" + PORT));

/*************** Socket ***************/
const io = require("socket.io")(server, {
  cors: {
    origin: "https://artichat-d0cc64c62685.herokuapp.com/",
  },
});

io.on("connection", async (socket) => {
  console.log(`🚀: ${socket.id} user just connected!`);

  const chatAuthId = socket.handshake.query.chatAuthId;
  if (chatAuthId) {
    // Update user status in db
    await updateUserOnline({ chatAuthId, socketId: socket.id });

    // Notify other users that the user is active
    socket.broadcast.emit(types.USER_ACTIVE, chatAuthId);
  }

  // Join socket
  socket.on(types.JOIN_ROOMS, (roomIds, cb) => {
    // filter room that socket not join 
    roomIds = roomIds.filter(roomId => !socket.rooms.has(roomId))
    socket.join(roomIds);
    cb(roomIds);
  });

  // Send new message
  socket.on(types.SEND_MESSAGE, async (data, cb) => {
    // let newRoom = undefined;
    // const existRoom = await checkIfRoomExists(data.roomId);

    // if (!existRoom) {
    //   /**
    //    * Create new room with the given data
    //    * @param {
    //    *  participants: Array of participants
    //    *  communityName: Name of the Community if it's a community
    //    * } data.roomData
    //    */
    //   newRoom = await createRoom(data.roomData);

    //   // Get active participants' socketIds except the user who is sending the message to notify them
    //   const socketIds = await getActiveUserSocketIds(
    //     data.roomData.participants.filter((id) => id !== userId)
    //   );

    //   if (socketIds) {
    //     socketIds.forEach((socketId) => {
    //       // Notify participants for the new room
    //       io.to(socketId).emit(types.JOIN_NEW_ROOM, {
    //         roomId: newRoom.roomId,
    //       });
    //       // receive socket join
    //       io.sockets.sockets.get(socketId).join(newRoom.roomId);
    //     });
    //   }
    //   socket.join(newRoom.roomId);
    // }

    // const roomId = existRoom ? existRoom.roomId : newRoom.roomId;

    const roomId = data.roomId;

    // send the received message to the sockets in the room
    socket.broadcast.to(roomId).emit(types.RECEIVE_MESSAGE, {
      message: data.message,
      roomId: roomId,
    });
    cb({
      status: "success",
      // isNewRoom: !!newRoom ?? false, // If there is a new room then true otherwise false
      // roomId,
    });
  });

  // For media feature
  socket.on(types.UPLOAD, async (data, callback) => {
    // save the content to the disk
    fs.writeFile(`./public/upload/${data.name}`, data.file, (err) => {
      callback({ message: err ? "failure" : "success" });
    });
  });

  socket.on(types.SEND_TYPING_STATUS, (data) => {
    socket.to(data.roomId).emit(types.RECEIVE_TYPING_STATUS, data);
  });

  socket.on(types.SEND_READ_TOKEN, (data) => {
    io.to(data.roomId).emit(types.RECEIVE_READ_TOKEN, data);
  });

  socket.on(types.DISCONNECT, async () => {
    socket.disconnect();

    const user = await disconnectUser(socket.id);

    if (user) {
      socket.broadcast.emit(types.USER_DISCONNECTED, user.chatAuthId); // notify other users that the particular user disconnected
    }

    console.log("🔥: A user disconnected: " + socket.id);
  });
});
/*************** Socket ***************/
