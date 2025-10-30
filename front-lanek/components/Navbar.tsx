import React from "react";
import { FiLogOut } from "react-icons/fi";

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <nav className="w-full bg-[#23232a] text-gray-100 flex items-center justify-between px-6 py-3 shadow-md">
      <div className="font-bold text-lg tracking-wide">Lanek Carbon</div>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={onLogout}
        title="Salir"
      >
        <FiLogOut size={20} />
        <span className="hidden sm:inline">Salir</span>
      </button>
    </nav>
  );
};

export default Navbar;
