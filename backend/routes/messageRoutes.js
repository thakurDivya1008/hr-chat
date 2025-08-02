const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  sendMessage,
  fetchMessages,
  UploadFileMessage,
} = require("../controller/messageController");
const multer=require("multer");
const upload=multer();
Router.post("/", verifyToken, sendMessage);
Router.post("/upload",verifyToken,upload.single("file"),UploadFileMessage)
Router.get("/:chatId", verifyToken, fetchMessages);

module.exports = Router;
