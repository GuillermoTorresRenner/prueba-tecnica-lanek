import React from "react";

interface ToastAlertProps {
  message: string;
  type: "success" | "fail";
  onClose: () => void;
}

const colors = {
  success: "bg-green-600 text-white border-green-700",
  fail: "bg-red-600 text-white border-red-700",
};

const ToastAlert: React.FC<ToastAlertProps> = ({ message, type, onClose }) => (
  <div
    className={`fixed bottom-8 right-8 z-100 px-6 py-3 rounded shadow-lg border ${colors[type]} flex items-center gap-3 animate-fade-in`}
    role="alert"
  >
    <span className="font-semibold">{message}</span>
    <button
      onClick={onClose}
      className="ml-4 text-white text-lg font-bold hover:text-gray-200"
      aria-label="Cerrar"
    >
      ×
    </button>
  </div>
);

export default ToastAlert;
