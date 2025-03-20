const ChatModel = require("../models/chatModel");
const UserModel = require("../models/userModel");
const MessageModel = require("../models/messageModel");
const httpStatusCode = require("../constants/httpStatusCode");

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "userId should not be empty",
      });
    }

    let isChat = await ChatModel.find({
      isGroupChat: false,
      users: {
        $all: [req.user._id, userId],
      },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await UserModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "username email",
    });

    if (isChat.length > 0) {
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "chat retrieve successfully",
        data: isChat[0],
      });
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const createdChat = await ChatModel.create(chatData);
      const fullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
    }
  } catch (error) {
    console.log("error while access chat:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Fetch all chats for a user
const fetchChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      users: {
        $elemMatch: {
          $eq: req.user._id,
        },
      },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedChats = await UserModel.populate(chats, {
      path: "latestMessage.sender",
      select: "username email",
    });

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "chats retrieved successfully",
      data: populatedChats,
    });
  } catch (error) {
    console.log("error while fetch chat:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { accessChat, fetchChats };
