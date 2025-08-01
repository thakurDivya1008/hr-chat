const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
      required: false,
    },
    file:{
      url:{
        type: String,
        required: false,
      },
      type:{
        type: String,
        required: false,
      },
      name:{
        type: String,
        required: false,
      },
      size:{
        type: Number,
        required: false,
      },
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);
