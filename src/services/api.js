import axios from 'axios';

// Usa proxy en desarrollo, URL directa en producción
const baseURL = import.meta.env.DEV ? 'api' : 'http://localhost:3000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error de API:', {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      console.error('Error de conexión:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;