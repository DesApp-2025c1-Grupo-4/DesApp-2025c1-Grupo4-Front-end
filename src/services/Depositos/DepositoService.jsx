import api from '../api';

export async function getAllDepositos() {
  try {
    const response = await api.get('/depositos', { 
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;

  } catch (error) {
    throw error;
  }
  
}