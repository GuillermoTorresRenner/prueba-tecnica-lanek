import { api } from "./api";
import { Emission } from "../types/emission";

// Obtener fuentes de emisión
export const getEmissionSources = async () => {
  const response = await api.get("/emission-source");
  return response.data;
};
// Obtener todas las emisiones del usuario
export const getMyEmissions = async (): Promise<Emission[]> => {
  const response = await api.get("/emission/");
  return response.data;
};

// Obtener una emisión por ID
export const getEmissionById = async (id: number): Promise<Emission> => {
  const response = await api.get(`/emission/${id}`);
  return response.data;
};

// Crear una nueva emisión
export const createEmission = async (data: {
  source_id: number;
  amount: number;
  title: string;
  description: string;
}): Promise<Emission> => {
  const response = await api.post("/emission/", data);
  return response.data;
};

// Actualizar una emisión existente
export const updateEmission = async (
  id: number,
  data: {
    source_id: number;
    amount: number;
    title: string;
    description: string;
  }
): Promise<Emission> => {
  const response = await api.put(`/emission/${id}`, data);
  return response.data;
};

// Eliminar una emisión
export const deleteEmission = async (id: number): Promise<void> => {
  await api.delete(`/emission/${id}`);
};
