import React from "react";
import CustomAlert from "./CustomAlert";
import { Emission } from "../types/emission";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Props {
  emissions: Emission[];
  onEdit?: (emission: Emission) => void;
  onDelete?: (id: number) => void;
}

const CardFingerprint: React.FC<Props> = ({ emissions, onEdit, onDelete }) => {
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(
    null
  );
  const [confirmDeleteName, setConfirmDeleteName] = React.useState<string>("");
  // Estado para fuentes de emisión (categoría)
  const [sources, setSources] = React.useState<{ id: number; name: string }[]>(
    []
  );
  const [categoryFilter, setCategoryFilter] = React.useState<number | "all">(
    "all"
  );
  const [sortBy, setSortBy] = React.useState<"fecha" | "co2" | "cantidad">(
    "fecha"
  );
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    // Obtener fuentes de emisión para mostrar nombre de categoría
    import("../api/api.emission").then(({ getEmissionSources }) => {
      getEmissionSources().then((data) => setSources(data));
    });
  }, []);

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

  const totalPages = Math.ceil(sortedEmissions.length / itemsPerPage);
  const paginatedEmissions = sortedEmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!emissions.length) {
    return (
      <div className="text-gray-300 text-center py-8">
        No hay emisiones registradas.
      </div>
    );
  }
  return (
    <div className="w-full">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEmissions.map((emission) => (
          <div
            key={emission.id}
            className="bg-slate-700 rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              <h4 className="text-blue-300 font-bold text-lg mb-2">
                {emission.title}
              </h4>
              <p className="text-gray-200 mb-2">{emission.description}</p>
              <div className="flex flex-col gap-1 mb-2">
                <span className="text-green-400 font-semibold">
                  Cantidad: {emission.amount}
                </span>
                <span className="text-yellow-400 font-semibold">
                  CO₂e: {emission.calculated_co2e}
                </span>
                <span className="text-gray-400">
                  Fecha: {new Date(emission.recorded_at).toLocaleDateString()}
                </span>
                <span className="text-blue-400 font-semibold">
                  Categoría:{" "}
                  {sources.find((src) => src.id === emission.source_id)?.name ||
                    emission.source_id}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
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
            </div>
          </div>
        ))}
        {/* Modal de confirmación de borrado */}
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
      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
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
    </div>
  );
};

export default CardFingerprint;
