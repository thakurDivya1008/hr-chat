const ChatModel = require("../models/chatModel");
const UserModel = require("../models/userModel");
const MessageModel = require("../models/messageModel");
const httpStatusCode = require("../constants/httpStatusCode");

const createChat = async (req, res) => {
  try {
    const { users, chatName, isGroupChat } = req.body;
    const userId = req.user._id;
    if (!userId) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "userId should not be empty",
      });
    }

    let isChat = await ChatModel.find({
      isGroupChat: false,
      users: {
        $all: [req.user._id, ...users],
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
    }
    let chatData;
    if(isGroupChat){
      const groupAdmin=users[0];
      chatData={
        chatName:chatName,
        isGroupChat:isGroupChat,
        users:[req.user._id,...users],
        createdBy:userId,
        groupAdmin:groupAdmin,
      };
    }else{
      chatData={
        chatName:chatName,
        isGroupChat:isGroupChat,
        users:[req.user._id,...users],
        createdBy:userId,
      };
    }
    
    const createdChat = await ChatModel.create(chatData);
    if (!createdChat) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "chat not created",
      });
    }
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "chat created successfully",
      data: createdChat,
    });
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
      .populate({
        path:"messages",
        populate:{
          path:"sender",
          select:"username email",
        }
      })
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

module.exports = { createChat, fetchChats };
