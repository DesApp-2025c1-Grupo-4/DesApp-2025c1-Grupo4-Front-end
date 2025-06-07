import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

import Home from './pages/Home/Home.jsx';
import RegistroViajes from './pages/Viajes/RegistroViajes.jsx';
import ListadoDeViajes from './pages/Viajes/ListadoDeViajes.jsx';
import { Empresas } from './pages/Empresas/Empresas.jsx';
//import RegistrarViaje from './pages/Viajes/RegistrarViaje.jsx';
//import ModificarViaje from './pages/Viajes/ModificarViaje.jsx';
//import Seguimiento from './pages/Viajes/Seguimiento.jsx';


const AppRoutes = () => {
  return (
    <Router>
      <App>
        <Routes>
          {/* Rutas declarativas para cada vista */}
          <Route path="/" element={<Home />} />
          <Route path="/registro-viajes" element={<RegistroViajes />} />
          <Route path="/empresas" element={<Empresas /> }/>
          <Route path="/listado-viajes" element={<ListadoDeViajes /> }/>
           {/*<Route path="/registrar-viaje" element={<RegistrarViaje />} />
          <Route path="/modificar-viaje" element={<ModificarViaje />} />
          <Route path="/seguimiento" element={<Seguimiento />} />*/}
        </Routes>
      </App>
    </Router>
  );
};

export default AppRoutes;