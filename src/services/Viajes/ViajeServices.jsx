import api from '../api';

export const getViajes = async (filtros = {}) => {
  try {
    const response = await api.get('/viajes?detalles=true', { 
      params: {
        ...filtros,
        fechaDesde: filtros.fechaDesde || undefined,
        fechaHasta: filtros.fechaHasta || undefined
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener viajes:", error);
    throw error;
  }
};