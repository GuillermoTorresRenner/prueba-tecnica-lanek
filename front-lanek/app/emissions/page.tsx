"use client";
"use client";
import EmissionsTable from "../../components/EmissionsTable";
import CardFingerprint from "../../components/CardFingerprint";
import FABAddEmission from "../../components/FABAddEmission";
import AddEmissionForm from "../../components/AddEmissionForm";
import ToastAlert from "../../components/ToastAlert";
import { createEmission } from "../../api/api.emission";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUserContext } from "../../context/userContext";
import { Emission } from "../../types/emission";
import CarbonLineChart from "../../components/CarbonLineChart";
import CarbonBarChart from "../../components/CarbonBarChart";
import CarbonPieChart from "../../components/CarbonPieChart";

export default function EmissionsPage() {
  // Navbar con logout
  const handleLogout = async () => {
    const { logout } = await import("../../api/api.auth");
    await logout();
    window.location.href = "/login";
  };
  // Handler para borrar emisión
  const handleDeleteEmission = async (id: number) => {
    try {
      const { deleteEmission, getMyEmissions } = await import(
        "../../api/api.emission"
      );
      await deleteEmission(id);
      setToast({ message: "Huella eliminada exitosamente", type: "success" });
      const data = await getMyEmissions();
      setEmissions(data);
    } catch {
      setToast({ message: "Error al eliminar la huella", type: "fail" });
    }
  };
  // Estado para edición
  const [editEmission, setEditEmission] = useState<Emission | null>(null);
  useAuth(true);
  const { user } = useUserContext();
  const [emissions, setEmissions] = useState<Emission[]>([]);

  // Cargar emisiones al montar
  React.useEffect(() => {
    async function fetchEmissions() {
      const { getMyEmissions } = await import("../../api/api.emission");
      const data = await getMyEmissions();
      setEmissions(data);
    }
    fetchEmissions();
  }, []);
  // Detecta si la pantalla es pequeña y muestra por defecto los cards
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [viewMode, setViewMode] = useState<"table" | "card">(
    isMobile ? "card" : "table"
  );
  // Handler para alternar vista
  const handleToggleView = () => {
    setViewMode((prev) => (prev === "table" ? "card" : "table"));
  };

  // Estado para mostrar el formulario
  const [showForm, setShowForm] = useState(false);

  // Estado para toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "fail";
  } | null>(null);

  // Oculta el toast automáticamente después de 3 segundos
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Guardar nueva emisión
  const handleSaveEmission = async (data: {
    source_id: number;
    amount: number;
    title: string;
    description: string;
  }) => {
    try {
      if (editEmission) {
        // Editar
        const { updateEmission } = await import("../../api/api.emission");
        await updateEmission(editEmission.id, data);
        setToast({ message: "Huella editada exitosamente", type: "success" });
      } else {
        // Guardar nuevo
        console.log("Datos enviados al crear emisión:", data);
        await createEmission(data);
        setToast({ message: "Huella agregada exitosamente", type: "success" });
      }
      setShowForm(false);
      setEditEmission(null);
      // Recargar emisiones desde la API para actualizar gráficos
      setTimeout(async () => {
        const { getMyEmissions } = await import("../../api/api.emission");
        const data = await getMyEmissions();
        setEmissions(data);
      }, 400);
    } catch {
      setToast({
        message: editEmission
          ? "Error al editar la huella"
          : "Error al guardar la huella",
        type: "fail",
      });
    }
  };

  // Callback para actualizar emisiones desde la tabla
  const handleEmissionsUpdate = (data: Emission[]) => {
    setEmissions(data);
  };

  // Datos para gráfico de línea
  const lineData = emissions.map((e) => ({
    fecha: new Date(e.recorded_at).toLocaleDateString(),
    co2e: e.calculated_co2e,
  }));

  // Datos para gráfico de barras acumulativo
  const barData = emissions.reduce<{ fecha: string; acumulado: number }[]>(
    (acc, e) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].acumulado : 0;
      acc.push({
        fecha: new Date(e.recorded_at).toLocaleDateString(),
        acumulado: prev + e.calculated_co2e,
      });
      return acc;
    },
    []
  );

  // Datos para gráfico de torta
  const typeMap: Record<string, number> = {};
  emissions.forEach((e) => {
    const tipo = e.description.split("fuente: ")[1]?.split(",")[0] || "Otro";
    typeMap[tipo] = (typeMap[tipo] || 0) + e.calculated_co2e;
  });
  const pieData = Object.entries(typeMap).map(([name, value]) => ({
    name,
    value,
  }));
  const pieColors = [
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#f472b6",
    "#10b981",
    "#6366f1",
    "#f59e42",
    "#eab308",
    "#84cc16",
    "#f43f5e",
    "#14b8a6",
    "#c026d3",
    "#64748b",
  ];

  return (
    <>
      <div className="min-h-screen bg-[#18181b] text-(--color-foreground) p-6 pt-6">
        <div className="mb-6">
          <div className="rounded-lg p-4 shadow-md bg-linear-to-r from-green-700 to-blue-900 text-white text-xl font-semibold">
            {user ? `¡Bienvenido, ${user.name}!` : "Bienvenido"}
          </div>
          <div className="mt-4 rounded-lg p-3 shadow bg-linear-to-r from-blue-600 to-blue-400 text-white text-lg font-semibold w-fit">
            Tus huellas de carbono
          </div>
        </div>
        {/* Gráficos de línea y barras en paralelo */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <CarbonLineChart data={lineData} />
          </div>
          <div className="flex-1">
            <CarbonBarChart data={barData} />
          </div>
        </div>
        {/* Gráfico de torta ocupando todo el ancho */}
        <div className="w-full mb-8">
          <CarbonPieChart data={pieData} colors={pieColors} />
        </div>
        {/* Banner antes de la tabla/tarjetas y botón deslizante */}
        <div className="mb-4 flex items-center gap-4">
          <div className="rounded-lg p-3 shadow bg-linear-to-r from-green-600 to-green-400 text-white text-lg font-semibold w-fit">
            Tus registros
          </div>
          <label className="flex items-center cursor-pointer select-none ml-2">
            <span className="mr-2 text-sm text-gray-200">Tabla</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={viewMode === "card"}
                onChange={handleToggleView}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-blue-700 rounded-full peer-checked:bg-green-500 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-6"></div>
            </div>
            <span className="ml-2 text-sm text-gray-200">Tarjetas</span>
          </label>
        </div>
        <div className="bg-[#23232a] rounded-lg shadow-md p-4 min-h-80 flex items-start justify-center transition-all duration-300 relative">
          {viewMode === "table" ? (
            <div className="w-full flex justify-center">
              <EmissionsTable
                emissions={emissions}
                onEdit={(emission) => {
                  setEditEmission(emission);
                  setShowForm(true);
                }}
                onDelete={handleDeleteEmission}
              />
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <CardFingerprint
                emissions={emissions}
                onEdit={(emission) => {
                  setEditEmission(emission);
                  setShowForm(true);
                }}
                onDelete={handleDeleteEmission}
              />
            </div>
          )}
          <FABAddEmission
            onClick={() => {
              setShowForm(true);
              setEditEmission(null);
            }}
          />
          {showForm && (
            <AddEmissionForm
              onClose={() => {
                setShowForm(false);
                setEditEmission(null);
              }}
              onSave={handleSaveEmission}
              initialData={editEmission ?? undefined}
              isEdit={!!editEmission}
            />
          )}
          {toast && (
            <ToastAlert
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
