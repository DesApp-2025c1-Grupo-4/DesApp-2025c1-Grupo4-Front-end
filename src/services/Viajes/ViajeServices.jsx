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

export const getViajesCompletados = async () => {
  try {
    const response = await api.get('/viajes?estado=completado&detalles=true');
    return response.data;
  } catch (error) {
    console.error("Error al obtener viajes completados:", error);
    throw error;
  }
};

export const getViajesEnTransito = async () => {
  try {
    const response = await api.get('/viajes?estado=en transito&detalles=true');
    return response.data;
  } catch (error) {
    console.error("Error al obtener viajes en tránsito:", error);
    throw error;
  }
};

export const getViajesConIncidentes = async () => {
  try {
    const response = await api.get('/viajes?estado=incidente,demorado&detalles=true');
    return response.data;
  } catch (error) {
    console.error("Error al obtener viajes con incidentes:", error);
    throw error;
  }
};