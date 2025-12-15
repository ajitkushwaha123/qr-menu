import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "@/store/slice/notificationSlice";
import restaurantReducer from "@/store/slice/restaurantSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    restaurant: restaurantReducer,
  },
});
