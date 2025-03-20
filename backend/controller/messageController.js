const MessageModel = require("../models/messageModel");
const ChatModel = require("../models/chatModel");
const httpStatusCode = require("../constants/httpStatusCode");

//send message
const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "content or chatId is missing",
      });
    }

    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    let message = await MessageModel.create(newMessage);
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "username email",
    });

    await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });

    req.app.get("io").to(chatId).emit("message received", message);

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "message added",
      data: message,
    });
  } catch (error) {
    console.log("error while send message:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error?.message,
    });
  }
};

//Fetch all messages for a chat
const fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "chatId is missing",
      });
    }

    const messages = await MessageModel.find({ chat: chatId })
      .populate("sender")
      .populate("chat");

    if (!messages) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "No messages found",
      });
    }

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "messages fetched",
      data: messages,
    });
  } catch (error) {
    console.log("error while fetch all message:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error?.message,
    });
  }
};

module.exports = { sendMessage, fetchMessages };
