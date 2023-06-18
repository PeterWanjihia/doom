const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello from DOOM!");
});

const PORT = process.env.PORT || 8000;

const onlineUsers = [];

const addOnlineUser = (user, socketId) => {
  !onlineUsers.some((u) => u.userId === user.userId) &&
    onlineUsers.push({ ...user, socketId });
};

const removeOnlineUser = (socketId) => {
  return onlineUsers.filter((u) => u.socketId !== socketId);
};

const placeOnCard = (cardId) => {};

io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  //add online user
  socket.on("addUser", (user) => {
    addOnlineUser(user, socket.id);
    io.emit("onlineUsers", onlineUsers);
  });

  //get online users
  socket.on("getOnlineUsers", () => {
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("bet", (circleId) => {});

  socket.on("removeUser", () => {
    console.log("disc");
    removeOnlineUser(socket.id);
    io.emit("onlineUsers", onlineUsers);
  });

  //disconnect a user
  socket.on("disconnect", () => {
    console.log("disc");
    removeOnlineUser(socket.id);
    io.emit("onlineUsers", onlineUsers);
  });
});

server.listen(PORT, () => {
  console.log("Server runnning on " + PORT);
});

module.exports = app;
