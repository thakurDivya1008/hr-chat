const express = require("express");
const { Login, Register } = require("../controller/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const chatRoutes = require("./chatRoutes");
const messageRoutes = require("./messageRoutes");
const Router = express.Router();

// User Routes
Router.post("/login", Login);
Router.post("/register", Register);

Router.use("/chat", chatRoutes);
Router.use("/message", messageRoutes);

module.exports = Router;
