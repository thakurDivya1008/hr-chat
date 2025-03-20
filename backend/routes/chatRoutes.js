const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const { accessChat, fetchChats } = require("../controller/chatController");

//access or create a one-one chat
Router.post("/", verifyToken, accessChat);

//fetch all chats
Router.get("/", verifyToken, fetchChats);
module.exports = Router;
