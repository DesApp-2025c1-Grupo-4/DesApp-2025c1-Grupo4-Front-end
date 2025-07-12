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

export async function getActiveDepositos() {
  try {
    const response = await api.get('/depositos?active=true');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getDepositoById(id) {
  try {
    const response = await api.get(`/depositos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createDeposito(depositoData) {
  try {
    const response = await api.post('/depositos', depositoData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateDeposito(id, depositoData) {
  try {
    const response = await api.patch(`/depositos/${id}`, depositoData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteDeposito(id) {
  try {
    // Intento 1: Usando la ruta estándar
    try {
      const response = await api.patch(`/depositos/${id}/delete`);
      return response.data;
    } catch (firstError) {
      console.warn('Primer intento fallido, probando alternativa...');
      
      // Intento 2: Alternativa más simple
      const response = await api.patch(`/depositos/${id}`, { activo: false });
      return response.data;
    }
  } catch (error) {
    console.error('Todos los intentos fallaron:', error);
    throw error;
  }
}