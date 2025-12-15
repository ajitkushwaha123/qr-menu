import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  notifications: [], // [{ id, type, message, duration, icon, button }]
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: {
      reducer(state, action) {
        state.notifications = [action.payload];
      },
      prepare({
        type = "info",
        message,
        duration = 3000,
        icon = null,
        button = null,
      }) {
        return {
          payload: {
            id: nanoid(),
            type, // "info" | "success" | "error" | "warning"
            message,
            duration,
            icon,
            button,
          },
        };
      },
    },

    removeNotification(state, action) {
      const id = action.payload;
      if (!id) {
        state.notifications = [];
        return;
      }
      state.notifications = state.notifications.filter((n) => n.id !== id);
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
