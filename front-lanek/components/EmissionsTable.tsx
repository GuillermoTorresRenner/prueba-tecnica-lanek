"use client";
import React, { useEffect, useState } from "react";
import CustomAlert from "./CustomAlert";
import { Emission } from "../types/emission";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface TableProps {
  emissions: Emission[];
  onEdit?: (emission: Emission) => void;
  onDelete?: (id: number) => void;
}

const EmissionsTable: React.FC<TableProps> = ({
  emissions,
  onEdit,
  onDelete,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

  // Estado para fuentes de emisión (categoría)
  const [sources, setSources] = useState<{ id: number; name: string }[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");

  // Filtros de orden
  const [sortBy, setSortBy] = useState<"fecha" | "co2" | "cantidad">("fecha");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(emissions.length / itemsPerPage);

  // Filtrar por categoría
  const filteredEmissions =
    categoryFilter === "all"
      ? emissions
      : emissions.filter((e) => e.source_id === categoryFilter);

  // Ordenar emisiones
  const sortedEmissions = [...filteredEmissions].sort((a, b) => {
    let valA, valB;
    if (sortBy === "fecha") {
      valA = new Date(a.recorded_at).getTime();
      valB = new Date(b.recorded_at).getTime();
    } else if (sortBy === "co2") {
      valA = a.calculated_co2e;
      valB = b.calculated_co2e;
    } else {
      valA = a.amount;
      valB = b.amount;
    }
    if (valA === valB) return 0;
    if (sortOrder === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  const paginatedEmissions = sortedEmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    // Obtener fuentes de emisión para mostrar nombre de categoría
    import("../api/api.emission").then(({ getEmissionSources }) => {
      getEmissionSources().then((data) => setSources(data));
    });
  }, []);

  // handleDelete function removed as it now uses the global handler passed via props

  return (
    <div className="overflow-x-auto mb-8">
      {/* Filtros de orden y categoría */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <label className="text-blue-300 font-semibold">
          Ordenar por:
          <select
            className="ml-2 px-2 py-1 rounded bg-slate-800 text-blue-200 border border-blue-700"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "fecha" | "co2" | "cantidad")
            }
          >
            <option value="fecha">Fecha</option>
            <option value="co2">CO₂e</option>
            <option value="cantidad">Cantidad</option>
          </select>
        </label>
        <label className="text-blue-300 font-semibold">
          Dirección:
          <select
            className="ml-2 px-2 py-1 rounded bg-slate-800 text-blue-200 border border-blue-700"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </label>
        <label className="text-blue-300 font-semibold">
          Categoría:
          <select
            className="ml-2 px-2 py-1 rounded bg-slate-800 text-blue-200 border border-blue-700"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
          >
            <option value="all">Todas</option>
            {sources.map((src) => (
              <option key={src.id} value={src.id}>
                {src.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <table className="min-w-full bg-[#23232a] text-gray-100 rounded-lg shadow-md">
        <thead className="bg-[#18181b] text-blue-300">
          <tr>
            <th className="py-2 px-4">Título</th>
            <th className="py-2 px-4">Descripción</th>
            <th className="py-2 px-4">Cantidad</th>
            <th className="py-2 px-4">CO₂e</th>
            <th className="py-2 px-4">Fecha</th>
            <th className="py-2 px-4">Categoría</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {emissions.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-300">
                No hay emisiones registradas.
              </td>
            </tr>
          ) : (
            paginatedEmissions.map((emission, idx) => (
              <tr
                key={emission.id}
                className={`border-b border-gray-700 ${
                  idx % 2 === 1 ? "bg-slate-700" : ""
                }`}
              >
                <td className="py-2 px-4">{emission.title}</td>
                <td className="py-2 px-4">{emission.description}</td>
                <td className="py-2 px-4">{emission.amount}</td>
                <td className="py-2 px-4">{emission.calculated_co2e}</td>
                <td className="py-2 px-4">
                  {new Date(emission.recorded_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {sources.find((src) => src.id === emission.source_id)?.name ||
                    emission.source_id}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="text-blue-400 hover:text-blue-600"
                    onClick={() => onEdit && onEdit(emission)}
                    title="Editar"
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-600"
                    onClick={() => {
                      setConfirmDeleteId(emission.id);
                      setConfirmDeleteName(emission.title);
                    }}
                    title="Borrar"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-blue-700 text-white disabled:bg-gray-600"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="text-blue-300 font-semibold">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-blue-700 text-white disabled:bg-gray-600"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
      {/* Alerta de confirmación para borrar */}
      {confirmDeleteId !== null && (
        <CustomAlert
          open={true}
          name={confirmDeleteName}
          onCancel={() => {
            setConfirmDeleteId(null);
            setConfirmDeleteName("");
          }}
          onConfirm={() => {
            if (onDelete) onDelete(confirmDeleteId);
            setConfirmDeleteId(null);
            setConfirmDeleteName("");
          }}
        />
      )}
    </div>
  );
};

export default EmissionsTable;
