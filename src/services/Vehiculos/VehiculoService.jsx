import api from '../api';

export async function getAllVehiculos() {
  try {
    const response = await api.get('/vehiculos', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getActiveVehiculos() {
  try {
    const response = await api.get('/vehiculos?activo=true');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getVehiculoById(id) {
  try {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createVehiculo(vehiculoData) {
  try {
    const response = await api.post('/vehiculos', vehiculoData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateVehiculo(id, vehiculoData) {
  try {
    const response = await api.put(`/vehiculos/${id}`, vehiculoData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteVehiculo(id) {
  try {
    const currentData = await getVehiculoById(id);
    const empresaId = typeof currentData.empresa === 'object' 
      ? currentData.empresa._id 
      : currentData.empresa;

    const dataToSend = {
      patente: currentData.patente,
      tipo_vehiculo: currentData.tipo_vehiculo,
      marca: currentData.marca,
      modelo: currentData.modelo,
      anio: currentData.anio,
      capacidad_carga: {
        volumen: currentData.capacidad_carga?.volumen || 0,
        peso: currentData.capacidad_carga?.peso || 0
      },
      empresa: empresaId,
      activo: false
    };

    const response = await api.put(`/vehiculos/${id}`, dataToSend);
    return response.data;
  } catch (error) {
    throw error;
  }
}