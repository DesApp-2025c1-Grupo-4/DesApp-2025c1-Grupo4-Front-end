import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

import { Header } from './commonComponents/Header.jsx';
import Home from './pages/Home/Home.jsx';
import ListadoViajes from './pages/Viajes/ListadoViajes.jsx';
import { ListadoEmpresas } from './pages/Empresas/ListadoEmpresas.jsx';
import { ListadoChoferes } from './pages/Choferes/ListadoChoferes.jsx';
import { ListadoDepositos } from './pages/Depositos/ListadoDepositos.jsx';
import { ListadoVehiculos } from './pages/Vehiculos/ListadoVehiculos.jsx';
import { ListadoReportes } from './pages/Reportes/ListadoReportes.jsx';
import { RegistrarViaje } from './pages/Viajes/RegistrarViaje.jsx';
import { ModificarViaje } from './pages/Viajes/ModificarViaje.jsx';
import { Seguimiento } from './pages/Viajes/Seguimiento.jsx';


const AppRoutes = () => {
  return (
    <Router>
      <App>
        <Header/>
        <Routes>
          {/* Rutas declarativas para cada vista */}
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<ListadoEmpresas /> }/>
          <Route path="/choferes" element={<ListadoChoferes /> }/>
          <Route path="/depositos" element={<ListadoDepositos /> }/>
          <Route path="/vehiculos" element={<ListadoVehiculos /> }/>
          <Route path="/reportes" element={<ListadoReportes /> }/>
          <Route path="/listado-viajes" element={<ListadoViajes /> }/>
          <Route path="/registrar-viaje" element={<RegistrarViaje />} />
          <Route path="/modificar-viaje" element={<ModificarViaje />} />
          <Route path="/seguimiento" element={<Seguimiento />} />
        </Routes>
      </App>
    </Router>
  );
};

export default AppRoutes;