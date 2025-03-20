import { createSlice } from '@reduxjs/toolkit';

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isOpen: true, 
    isMobile: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      console.log("isOpen",state.isOpen)
      state.isOpen = !state.isOpen;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
    setMobileView: (state, action) => {
      state.isMobile = action.payload;
      if (state.isMobile) {
        state.isOpen = false;
      }
    },
  },
});

export const { toggleSidebar, closeSidebar, setMobileView } = sidebarSlice.actions;
export default sidebarSlice.reducer;
