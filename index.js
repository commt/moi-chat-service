const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");

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
app.use("/", (req, res) => res.send("Welcome"));

const server = http.createServer(app);

server.listen(PORT, () => console.log("server running on port:" + PORT));

/*************** Socket ***************/
const io = require("socket.io")(server, {
  cors: {
    origin: "https://artichat-d0cc64c62685.herokuapp.com/",
  },
});

io.on("connection", async (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    // Update user status in db
    await updateUserOnline({ userId, socketId: socket.id });

    // Notify other users that the user is active
    socket.broadcast.emit("userActive", userId);
  }

  // Join socket
  socket.on("joinRoom", (roomId, cb) => {
    socket.join(roomId);
    cb(roomId);
  });

  // Send new message
  socket.on("sendMessage", async (data, cb) => {
    let newRoom = undefined;
    const existRoom = await checkIfRoomExists(data.roomId);

    if (!existRoom) {
      /**
       * Create new room with the given data
       * @param {
       *  participants: Array of participants
       *  communityName: Name of the Community if it's a community
       * } data.roomData
       */
      newRoom = await createRoom(data.roomData);

      // Get active participants' socketIds except the user who is sending the message to notify them
      const socketIds = await getActiveUserSocketIds(
        data.roomData.participants.filter((id) => id !== userId)
      );

      if (socketIds) {
        socketIds.forEach((socketId) => {
          // Notify participants for the new room
          io.to(socketId).emit("joinNewRoom", {
            roomId: newRoom.roomId,
          });
          // receive socket join
          io.sockets.sockets.get(socketId).join(newRoom.roomId);
        });
      }
      socket.join(newRoom.roomId);
    }

    const roomId = existRoom ? existRoom.roomId : newRoom.roomId;

    // send the received message to the sockets in the room
    socket.broadcast.to(roomId).emit("handleNewMessage", {
      message: data.message,
      roomId: roomId,
    });
    cb({
      status: "success",
      isNewRoom: !!newRoom ?? false, // If there is a new room then true otherwise false
      roomId,
    });
  });

  // For media feature
  socket.on("upload", async (data, callback) => {
    // save the content to the disk
    fs.writeFile(`./public/upload/${data.name}`, data.file, (err) => {
      callback({ message: err ? "failure" : "success" });
    });
  });

  socket.on("disconnect", async () => {
    socket.disconnect();

    const user = await disconnectUser(socket.id);

    if (user) {
      socket.broadcast.emit("userDisconnected", user._id); // notify other users that the particular user disconnected
    }

    console.log("🔥: A user disconnected: " + socket.id);
  });
});
/*************** Socket ***************/
