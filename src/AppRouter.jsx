import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './components/Home/Home.jsx';
import RegistroViajes from './components/RegistroViajes/RegistroViajes.jsx';
import ListadoDeViajes from './components/ListadoDeViajes/ListadoDeViajes.jsx';

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
