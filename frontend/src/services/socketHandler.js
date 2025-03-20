import { io } from "socket.io-client";

// Create a singleton socket instance
const socket = io(import.meta.env.VITE_API_URL);

// Setup function to be called after user login
const setupSocket = (userData) => {
  // Setup socket connection with user data
  if (userData) {
    socket.emit("setup", userData);
    
    // Listen for connection confirmation
    socket.on("connected", () => {
      console.log("Socket connected successfully");
    });
  }
};

// Function to join a specific chat room
const joinChatRoom = (chatId) => {
  if (chatId) {
    socket.emit("join chat", chatId);
    console.log("Joined chat room:", chatId);
  }
};

// Send a message
const sendMessage = (newMessage) => {
  if (newMessage) {
    socket.emit("new message", newMessage);
  }
};

// Clean up socket listeners
const cleanupSocket = () => {
  socket.off("connected");
  socket.off("message received");
};

export { socket, setupSocket, joinChatRoom, sendMessage, cleanupSocket };