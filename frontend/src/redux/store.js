import { createReducer } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sidebarReducer from "./slices/sidebarSlice";
import chatReducer from "./slices/chatSlice";
import macroReducer from "./slices/macroSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
    chat: chatReducer,
    macro: macroReducer,
  },
});

export default store;
