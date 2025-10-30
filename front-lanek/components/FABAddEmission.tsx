import React from "react";
import { FiPlus } from "react-icons/fi";

interface Props {
  onClick: () => void;
}

const FABAddEmission: React.FC<Props> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-800 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all"
    title="Agregar huella de carbono"
    aria-label="Agregar huella de carbono"
  >
    <FiPlus />
  </button>
);

export default FABAddEmission;
