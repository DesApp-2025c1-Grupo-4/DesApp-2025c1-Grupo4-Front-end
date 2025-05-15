import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import NewPage from './components/Home/Home';
import RegistroViajes from './components/RegistroViajes/RegistroViajes'; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/newpage" element={<NewPage />} />
        <Route path="/registro-viajes" element={<RegistroViajes />} /> 
        {/* Añade la nueva ruta */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
