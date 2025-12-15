"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useNotification } from "@/store/hooks/useNotification";

const variantStyles = {
  error: {
    ring: "ring-red-400/40",
    bg: "bg-red-50/70 dark:bg-red-900/40 backdrop-blur-xl",
    text: "text-red-800 dark:text-red-100",
    defaultIcon: <AlertTriangle size={20} className="text-red-600" />,
  },
  success: {
    ring: "ring-green-400/40",
    bg: "bg-green-50/70 dark:bg-green-900/40 backdrop-blur-xl",
    text: "text-green-800 dark:text-green-100",
    defaultIcon: <CheckCircle2 size={20} className="text-green-600" />,
  },
  info: {
    ring: "ring-blue-400/40",
    bg: "bg-blue-50/70 dark:bg-blue-900/40 backdrop-blur-xl",
    text: "text-blue-800 dark:text-blue-100",
    defaultIcon: <Info size={20} className="text-blue-600" />,
  },
};

export default function Alert({
  id,
  message,
  icon,
  variant = "error",
  button = null,
}) {
  const styles = variantStyles[variant] || variantStyles.error;
  const { removeNotification } = useNotification();

  const handleClose = () => {
    if (id) {
      removeNotification(id);
    } else {
      removeNotification();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`w-full rounded-md  p-4 sm:p-5 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        ring-1 ${styles.ring} ${styles.bg} ${styles.text} flex flex-row 
        gap-4 items-start sm:items-center justify-between`}
      role="alert"
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="p-2 rounded-md bg-white/70 dark:bg-black/30 shadow-sm flex items-center justify-center">
          {icon || styles.defaultIcon}
        </div>

        <p className="text-sm sm:text-base font-semibold leading-relaxed truncate">
          {message}
        </p>
      </div>

      {button && <div className="ml-2">{button}</div>}

      <button
        type="button"
        onClick={handleClose}
        className="p-2 rounded-md bg-white/70 dark:bg-black/30 shadow-sm flex items-center justify-center hover:bg-white/90 dark:hover:bg-black/40 transition"
        aria-label="Dismiss notification"
      >
        <X size={16} className="text-gray-600" />
      </button>
    </motion.div>
  );
}
