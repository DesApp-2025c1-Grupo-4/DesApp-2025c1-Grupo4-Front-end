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