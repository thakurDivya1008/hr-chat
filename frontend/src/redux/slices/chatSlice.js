import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChat: null,
  chatList: null,
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
  },
});

export const {setActiveChat,setChatList}=chatSlice.actions;
export default chatSlice.reducer;