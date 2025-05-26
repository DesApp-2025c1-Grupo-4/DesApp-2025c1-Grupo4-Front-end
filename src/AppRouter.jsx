import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home/HomePage";
import { EmpresasPage } from "./pages/Empresas//EmpresasPage";
import { VehiculosPage } from "./pages/Vehiculos/VehiculosPage";
import { ChoferesPage } from "./pages/Choferes/ChoferesPage";
import { DepositosPage } from "./pages/Depositos/DepositosPage";
import { ViajesPage } from "./pages/Viajes/ViajesPage";
import { ReportesPage } from "./pages/Reportes/ReportesPage";
import { ListadoViajesPage } from "./pages/Viajes/ListadoViajes";

export function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/empresas' element={<EmpresasPage />} />
      <Route path='/vehiculos' element={<VehiculosPage />} />
      <Route path='/choferes' element={<ChoferesPage />} />
      <Route path='/depositos' element={<DepositosPage />} />
      <Route path='/viajes' element={<ViajesPage />} />
      <Route path='/reportes' element={<ReportesPage />} />
      <Route path="/listado-viajes" element={<ListadoViajesPage />} />
    </Routes>
  );
}