import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../src/commonComponents/MainLayout';

import Home from './pages/Home/Home.jsx';
import ListadoViajes from './pages/Viajes/ListadoViajes.jsx';
import { ListadoEmpresas } from './pages/Empresas/ListadoEmpresas.jsx';
import { ListadoChoferes } from './pages/Choferes/ListadoChoferes.jsx';
import { ListadoDepositos } from './pages/Depositos/ListadoDepositos.jsx';
import { ListadoVehiculos } from './pages/Vehiculos/ListadoVehiculos.jsx';
import { ListadoReportes } from './pages/Reportes/ListadoReportes.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<ListadoEmpresas />} />
          <Route path="/choferes" element={<ListadoChoferes />} />
          <Route path="/depositos" element={<ListadoDepositos />} />
          <Route path="/vehiculos" element={<ListadoVehiculos />} />
          <Route path="/reportes" element={<ListadoReportes />} />
          <Route path="/listado-viajes" element={<ListadoViajes />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
