import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChat: null,
  chatList: null,
  messages: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
    setMessages: (state, action) => {
      console.log("action.payload", action.payload);
      state.activeChat.messages.push(action.payload);
      const message = action.payload;
      state.chatList.forEach((chat) => {
        if (chat?._id === message?.chat) {
          chat.messages.push(message);
        }
      });
    },
  },
});

export const { setActiveChat, setChatList, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
