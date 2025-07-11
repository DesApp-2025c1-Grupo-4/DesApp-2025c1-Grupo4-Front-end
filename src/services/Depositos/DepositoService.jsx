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
    const response = await api.patch(`/depositos/${id}/delete`, { activo: false });
    return response.data;
  } catch (error) {
    throw error;
  }
}