import api from '../api';

export async function getAllEmpresas() {
  try {
    const response = await api.get('/empresas', { 
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;

  } catch (error) {
    throw error;
  }
  
}