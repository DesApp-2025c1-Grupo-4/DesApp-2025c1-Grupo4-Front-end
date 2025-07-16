import { useEffect, useState } from 'react';

const App = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Petición al backend (ruta /api/data)
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Error:', err));
  }, []);

  return (
    <div className="app">
      {children}
      {data && <p>{data.message}</p>} {/* Muestra la respuesta del backend */}
    </div>
  );
};

export default App;