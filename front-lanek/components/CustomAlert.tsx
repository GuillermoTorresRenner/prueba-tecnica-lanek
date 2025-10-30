import React from "react";

interface CustomAlertProps {
  open: boolean;
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  open,
  name,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-[#23232a] rounded-lg shadow-lg p-6 w-full max-w-sm text-gray-100">
        <h2 className="text-lg font-bold mb-2 text-red-600">
          ¿Eliminar registro?
        </h2>
        <p className="mb-4">
          ¿Seguro que deseas eliminar{" "}
          <span className="font-semibold">{name}</span>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
