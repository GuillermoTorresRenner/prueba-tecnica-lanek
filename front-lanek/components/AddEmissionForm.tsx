import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getEmissionSources } from "../api/api.emission";

interface EmissionSource {
  emission_factor: string;
  id: number;
  name: string;
}

interface FormData {
  source_id: number;
  amount: number;
  title: string;
  description: string;
}

interface Props {
  onClose: () => void;
  onSave: (data: FormData) => void;
  initialData?: Partial<FormData>;
  isEdit?: boolean;
}

const AddEmissionForm: React.FC<Props> = ({
  onClose,
  onSave,
  initialData,
  isEdit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [sources, setSources] = useState<EmissionSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<number | "">(
    initialData?.source_id ?? ""
  );

  // Inicializar el formulario con los datos si es edición
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof FormData, value as unknown as string);
      });
      if (initialData.source_id) setSelectedSource(initialData.source_id);
    }
    // Solo ejecutar una vez al montar si hay initialData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmissionSources().then((data) => {
      setSources(data);
      setLoading(false);
    });
  }, []);

  const onSubmit = (data: FormData) => {
    // Asegura que source_id y amount sean número
    const payload = {
      ...data,
      source_id:
        typeof data.source_id === "string"
          ? parseInt(data.source_id)
          : data.source_id,
      amount:
        typeof data.amount === "string" ? parseFloat(data.amount) : data.amount,
    };
    onSave(payload);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#23232a] rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-blue-300 mb-6">
          Agregar huella de carbono
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-200 mb-1">
              Fuente de emisión
            </label>
            <select
              {...register("source_id", {
                required: "Selecciona una fuente de emisión",
                validate: (v) => {
                  const val = typeof v === "string" ? parseInt(v) : v;
                  return val > 0 || "Selecciona una fuente de emisión";
                },
              })}
              className={`w-full p-2 rounded bg-slate-800 text-gray-100 border border-gray-700 ${
                errors.source_id ? "border-red-500" : ""
              }`}
              defaultValue=""
              onChange={(e) => setSelectedSource(Number(e.target.value))}
            >
              <option value="" disabled>
                Selecciona una fuente
              </option>
              {loading ? (
                <option>Cargando...</option>
              ) : (
                sources.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.name}
                  </option>
                ))
              )}
            </select>
            {errors.source_id && (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.source_id.message?.toString()}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-200 mb-1">
              Cantidad
              {(() => {
                if (!selectedSource || !sources.length) return null;
                const src = sources.find((s) => s.id === selectedSource);
                if (!src) return null;
                let unidad = "";
                switch (src.name) {
                  case "Electricidad (promedio Chile)":
                    unidad = "kWh";
                    break;
                  case "Gasolina":
                  case "Diésel":
                  case "Gas Natural":
                  case "Auto particular (nafta)":
                  case "Auto particular (diésel)":
                    unidad = "litros";
                    break;
                  case "Transporte público (bus)":
                  case "Transporte público (metro/tren)":
                    unidad = "km";
                    break;
                  case "Vuelo (corto alcance)":
                  case "Vuelo (largo alcance)":
                    unidad = "km";
                    break;
                  case "Residuos domiciliarios":
                  case "Papel":
                  case "Plástico":
                    unidad = "kg";
                    break;
                  default:
                    unidad = "unidad";
                }
                return (
                  <span className="ml-2 text-base text-blue-300 font-semibold">
                    ({unidad})
                  </span>
                );
              })()}
            </label>
            <input
              type="number"
              {...register("amount", {
                required: "La cantidad es obligatoria",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
              className={`w-full p-2 rounded bg-slate-800 text-gray-100 border border-gray-700 ${
                errors.amount ? "border-red-500" : ""
              }`}
            />
            {errors.amount && (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.amount.message?.toString()}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Título</label>
            <input
              type="text"
              {...register("title", { required: "El título es obligatorio" })}
              className={`w-full p-2 rounded bg-slate-800 text-gray-100 border border-gray-700 ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.title.message?.toString()}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Descripción</label>
            <textarea
              {...register("description", {
                required: "La descripción es obligatoria",
              })}
              className={`w-full p-2 rounded bg-slate-800 text-gray-100 border border-gray-700 ${
                errors.description ? "border-red-500" : ""
              }`}
              rows={3}
            />
            {errors.description && (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.description.message?.toString()}
              </span>
            )}
          </div>
          <button
            type="submit"
            className={`mt-4 font-semibold py-2 rounded shadow ${
              isEdit
                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                : "bg-blue-600 hover:bg-blue-800 text-white"
            }`}
          >
            {isEdit ? "Editar" : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmissionForm;
