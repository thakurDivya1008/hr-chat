const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    //setup socket for specific user
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    //join a chat room
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined room: " + room);
    });

    //Handle new messages
    socket.on("new message", (newMessage) => {
      const chat = newMessage.chat;
      if (!chat.users) {
        console.log("Chat.users not defined");
        return;
      }

      //Emit the message to all users in the chat except the sender
      chat.users.forEach((user) => {
        if (user._id === newMessage.sender._id) {
          return;
        }
        socket.in(user._id).emit("message received", newMessage);
      });
    });

    //Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

module.exports = initializeSocket;
