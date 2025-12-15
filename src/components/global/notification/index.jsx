"use client";

import React from "react";
import Alert from "./alert";
import { useNotification } from "@/store/hooks/useNotification";

const Notification = () => {
  const { notifications } = useNotification();

  if (!notifications || notifications.length === 0) return null;

  const note = notifications[0];

  return (
    <div className="fixed inset-x-0 top-4 z-10000 flex justify-center px-4 sm:px-0 pointer-events-none">
      <div className="w-full max-w-xl pointer-events-auto">
        <Alert
          id={note.id}
          message={note.message}
          variant={note.type}
          icon={note.icon}
          button={note.button}
        />
      </div>
    </div>
  );
};

export default Notification;
