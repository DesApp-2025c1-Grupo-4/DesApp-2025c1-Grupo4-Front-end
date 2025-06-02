
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
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