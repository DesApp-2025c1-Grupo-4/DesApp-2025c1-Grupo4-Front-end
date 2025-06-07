import api from '../api';

export async function getAllChoferes() {
  try {
    const response = await api.get('/choferes', { 
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(response.data)
    return response.data;

  } catch (error) {
    throw error;
  }
  
}