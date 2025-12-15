import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  removeNotification,
} from "@/store/slice/notificationSlice";

export const useNotification = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  const notify = useCallback(
    (type, message, duration = 3000, extra = {}) => {
      dispatch(
        addNotification({
          type,
          message,
          duration,
          ...extra, // icon, button, etc.
        })
      );
    },
    [dispatch]
  );

  const clear = useCallback(
    (id) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  return {
    success: (msg, duration, extra) => notify("success", msg, duration, extra),
    error: (msg, duration, extra) => notify("error", msg, duration, extra),
    warning: (msg, duration, extra) => notify("warning", msg, duration, extra),
    info: (msg, duration, extra) => notify("info", msg, duration, extra),
    custom: ({ type, message, duration, ...extra }) =>
      notify(type, message, duration, extra),
    notifications,
    removeNotification: clear,
  };
};
