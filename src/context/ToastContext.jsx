import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  function openAndHideToast(message) {
    setOpen(true);
    setMessage(message);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  }
  return (
    <>
      <Toast open={open} message={message} />
      <ToastContext.Provider value={{ openAndHideToast }}>
        {children}
      </ToastContext.Provider>
    </>
  );
};

export const useToast = () => useContext(ToastContext);
