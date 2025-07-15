const express = require("express");
const {
  Login,
  Register,
  ViewAllUser,
} = require("../controller/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const chatRoutes = require("./chatRoutes");
const messageRoutes = require("./messageRoutes");
const Router = express.Router();

// User Routes
Router.post("/login", Login);
Router.post("/register", Register);
Router.get("/user/all", ViewAllUser);

Router.use("/chat", chatRoutes);
Router.use("/message", messageRoutes);

module.exports = Router;
