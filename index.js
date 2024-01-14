const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Commt } = require('@commt/node-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

Commt.init({
  apiKey: process.env.COMMT_API_KEY,
  secret: process.env.COMMT_SECRET_KEY,
  projectId: process.env.COMMT_PROJECT_ID,
  APIUrl: process.env.COMMT_API_URL
});

global.commt = Commt.with();

/*************** DB Connection ***************/
const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI, {
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