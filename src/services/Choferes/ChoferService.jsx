import api from '../api';

export async function getAllChoferes() {
  try {
    const response = await api.get('/choferes', { 
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getActiveChoferes() {
  try {
    const response = await api.get('/choferes?activo=true');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getChoferById(id) {
  try {
    const response = await api.get(`/choferes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createChofer(choferData) {
  try {
    const response = await api.post('/choferes', choferData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateChofer(id, choferData) {
  try {
    const response = await api.put(`/choferes/${id}`, choferData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteChofer(id) {
  try {
    const response = await api.patch(`/choferes/${id}/delete`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
