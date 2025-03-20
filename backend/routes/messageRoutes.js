const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  sendMessage,
  fetchMessages,
} = require("../controller/messageController");

Router.post("/", verifyToken, sendMessage);
Router.get("/:chatId", verifyToken, fetchMessages);

module.exports = Router;
