import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home/Home.jsx';
import RegistroViajes from './pages/Viajes/RegistroViajes.jsx';
import ListadoDeViajes from './pages/Viajes/ListadoDeViajes.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro-viajes" element={<RegistroViajes />} />
          <Route path="/listado-viajes" element={<ListadoDeViajes />} />
        </Routes>
      </App>
    </Router>
  );
};

export default AppRoutes;
