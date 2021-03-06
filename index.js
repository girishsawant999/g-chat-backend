// Node server which will handle request
const io = require("socket.io")(process.env.PORT || 8000);
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (user) => {
    users[socket.id] = user;
    socket.broadcast.emit(
      "user-joined",
      socket.id,
      new Date().toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      users
    );
    socket.emit("get-users-list", socket.id, users);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      time: new Date().toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      user: users[socket.id],
    });
  });

  socket.on("typing", (isTyping) => {
    socket.broadcast.emit("typing-Waiting", {
      user: isTyping ? users[socket.id] : null,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit(
      "left",
      socket.id,
      new Date().toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      users
    );
    delete users[socket.id];
  });
});
