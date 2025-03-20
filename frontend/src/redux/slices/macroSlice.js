import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeMacro: false,
  chatList: null,
};

const macroSlice = createSlice({
  name: "macro",
  initialState: initialState,
  reducers: {
    setActiveMacro: (state, action) => {
      state.activeMacro = action.payload;
    },
  },
});

export const {setActiveMacro}=macroSlice.actions;
export default macroSlice.reducer;