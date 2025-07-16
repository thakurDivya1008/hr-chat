const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const chatModel = require("./models/chatModel");
const messageModel = require("./models/messageModel");
dotenv.config();

const initializeSocket = (server) => {
  console.log("Initializing socket");
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    
    // JWT Token verification with error handling
    try {
      const token = socket.handshake?.auth?.headers;
      console.log("Token received:", token ? "Token present" : "No token");
      
      if (!token) {
        console.log("No token provided");
        socket.disconnect();
        return;
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully for user:", decoded.user?._id );
      socket.userId = decoded?.user?._id ; // Store user ID on socket
      
    } catch (error) {
      console.log("JWT verification failed:", error.message);
      socket.disconnect();
      return;
    }

    // Setup socket for specific user
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
      console.log(`User ${userData._id} setup completed`);
    });

    // Join a chat room
    socket.on("join chat", async (room) => {
      try {
        console.log("Join chat request:", room);
        
        if (!room?.chatId) {
          console.log("No chatId provided");
          return;
        }
        
        // Convert to string to ensure consistency
        const chatId = room.chatId.toString();
        const userId = room.userId || socket.userId;
        
        console.log("User joined room:", chatId);
        socket.join(chatId);
        socket.userId = userId;
        socket.chatId = chatId;
        console.log("User joined:", userId);

        await handleConsoleSockets(chatId);
        
        // Emit confirmation that user joined
        socket.emit("joined chat", { chatId, userId });
        
      } catch (error) {
        console.log("Error joining chat:", error);
        socket.emit("error", { message: "Failed to join chat" });
      }
    });

    // Handle console sockets
    const handleConsoleSockets = async (chatId) => {
      try {
        const socketsInRoom = await io.in(chatId).fetchSockets();
        const socketIds = socketsInRoom.map(socket => socket.id);
        const userIds = socketsInRoom.map(socket => socket.userId).filter(Boolean);
        
        console.log("Socket IDs in room:", socketIds);
        console.log("User IDs in room:", userIds);
        
        // Emit to room about current users
        io.to(chatId).emit("room users", userIds);
        
      } catch (error) {
        console.log("Error in handleConsoleSockets:", error);
      }
    };

    // Handle new messages
    socket.on("new message", async (newMessage) => {
      console.log("New message received:", newMessage);
      
      try {
        // Validate required fields
        if (!newMessage?.chatId || !newMessage?.message || !newMessage?.sender) {
          console.log("Missing required message fields");
          socket.emit("error", { message: "Missing required message fields" });
          return;
        }
        
        // Convert chatId to string for consistency
        const chatId = newMessage.chatId.toString();
        
        // Find the chat
        const chat = await chatModel.findById(chatId);
        if (!chat) {
          console.log("Chat not found:", chatId);
          socket.emit("error", { message: "Chat not found" });
          return;
        }
        
        console.log("Chat found:", chat._id);
        
        // Create the message
        const message = await messageModel.create({
          content: newMessage.message,
          sender: newMessage.sender,
          chat: chat._id,
        });
        
        console.log("Message created:", message._id);
        
        // Update chat with new message
        chat.messages.push(message._id);
        await chat.save();
        
        console.log("Chat updated with message");
        
        // Populate the message with sender details
        const fullMessage = await messageModel
          .findById(message._id)
          .populate("sender", "username email");
          
        console.log("Message populated:", fullMessage);
        
        // Convert chat._id to string for room emission
        const roomId = chat._id.toString();
        
        console.log("Emitting to room:", roomId);
        
        // Emit to all users in the chat room
        io.to(roomId).emit("message received", fullMessage);
        
        console.log("Message emitted successfully");
        
      } catch (error) {
        console.log("Error in new message handler:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    //handle typing
    socket.on("typing", (chatId, userId) => {
      io.to(chatId).emit("typing", { user: userId });
    });
    socket.on("stop typing", (chatId, userId) => {
      io.to(chatId).emit("stop typing", { user: userId });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (socket.chatId) {
        handleConsoleSockets(socket.chatId);
      }
    });
  });

  return io;
};

module.exports = initializeSocket;