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

export async function getActiveEmpresas() {
  try {
    const response = await api.get('/empresas?activo=true');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getEmpresaById(id) {
  try {
    const response = await api.get(`/empresas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createEmpresa(empresaData) {
  try {
    const response = await api.post('/empresas', empresaData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateEmpresa(id, empresaData) {
  try {
    const response = await api.put(`/empresas/${id}`, empresaData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteEmpresa(id) {
  try {
    const empresa = await getEmpresaById(id);
    const { _id, ...empresaData } = empresa;
    delete empresaData.domicilio_fiscal?._id;
    delete empresaData.datos_contacto?._id;
    empresaData.activo = false;
    
    const response = await api.put(`/empresas/${id}`, empresaData);
    return response.data;
  } catch (error) {
    throw error;
  }
}