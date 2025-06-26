// useDebouncedFetch.js
import { useEffect } from 'react';
import axios from 'axios';

const useDebouncedFetch = (url, paramName, value, setData, setLoading) => {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url, { 
          params: {},
          signal 
        });
        // Filtra solo items activos como en la versión original
        const activos = Array.isArray(res.data) ? res.data.filter(e => e.activo !== false) : [];
        setData(activos);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(`Error fetching ${url}:`, error);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchWithSearch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url, { 
          params: { [paramName]: value },
          signal 
        });
        const activos = Array.isArray(res.data) ? res.data.filter(e => e.activo !== false) : [];
        setData(activos);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(`Error fetching ${url}:`, error);
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (!value || value.length === 0 || value.length > 2) {
        fetchData();
      } else {
        fetchWithSearch();
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [url, paramName, value, setData, setLoading]);
};

export default useDebouncedFetch;