import { toast } from "sonner";

// Custom toast styles matching the app's retro aesthetic
const toastStyles = {
  className: "font-mono",
  style: {
    background: "rgba(20, 20, 20, 0.95)",
    border: "2px solid var(--cyan)",
    color: "var(--cyan)",
    fontFamily: "var(--font-family-mono)",
    backdropFilter: "blur(10px)",
  },
};

export const showError = (message: string) => {
  return toast.error(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      border: "2px solid var(--lime)",
      color: "var(--lime)",
    },
    duration: 5000,
  });
};

export const showSuccess = (message: string) => {
  return toast.success(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      border: "2px solid var(--lime)",
      color: "var(--lime)",
    },
    duration: 3000,
  });
};

export const showInfo = (message: string) => {
  return toast.info(message, {
    ...toastStyles,
    duration: 4000,
  });
};

export const showWarning = (message: string) => {
  return toast.warning(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      border: "2px solid #ffaa00",
      color: "#ffaa00",
    },
    duration: 4000,
  });
};
