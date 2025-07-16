import { useEffect } from 'react';
import axios from 'axios';

const useDebouncedFetch = (url, paramName, value, setData, setLoading, extraParams = {}) => {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          ...(value && paramName && { [paramName]: value }),
          activo: true,
          ...extraParams
        };

        const res = await axios.get(url, { 
          params,
          signal 
        });
        
        const filteredData = Array.isArray(res.data) 
          ? res.data.filter(item => item.activo !== false) 
          : res.data;
          
        setData(filteredData);
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
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [url, paramName, value, setData, setLoading, JSON.stringify(extraParams)]);
};

export default useDebouncedFetch;