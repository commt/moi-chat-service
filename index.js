const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

/*************** DB Connection ***************/
const connectDB = () => {
  mongoose
    .connect("mongodb+srv://test:artichat@test-cluster.dsn5ceu.mongodb.net/", {
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

const server = app.listen(port || 3001, '0.0.0.0', () =>
  console.log("server running on port:" + port)
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
