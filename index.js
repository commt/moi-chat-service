const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');

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

const userRouter = require('./routes/user');

app.use('/user', userRouter);
app.use('/', (req, res) => res.send('Welcome'));

const server = http.createServer(app);

server.listen(PORT, () =>
  console.log("server running on port:" + PORT)
);

/*************** Socket ***************/
const io = require("socket.io")(server, {
  cors: {
    origin: "<https://artichat-d0cc64c62685.herokuapp.com/>", // TODO: Heroku endpoint
  },
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});
/*************** Socket ***************/
