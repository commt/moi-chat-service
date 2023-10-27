const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

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

const userRouter = require("./routes/user");
const roomRouter = require("./routes/room");
const chatRouter = require("./routes/chat");

app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/chat", chatRouter);
app.use("/", (req, res) => res.send('Welcome!'));

app.listen(PORT, () => console.log("server running on port:" + PORT));