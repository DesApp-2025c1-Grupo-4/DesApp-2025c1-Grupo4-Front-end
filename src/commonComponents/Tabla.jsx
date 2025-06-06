import { useLocation } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';

const Tabla = ({ data }) => {
  const location = useLocation();

  const renderTableHeaders = () => {
    // Solo implementamos listado-viajes por ahora
    if (location.pathname === '/listado-viajes') {
      return (
        <>
          <TableCell>Número</TableCell>
          <TableCell>Empresa Transportista</TableCell>
          <TableCell>Chofer</TableCell>
          <TableCell>Vehículo</TableCell>
          <TableCell>Fecha</TableCell>
          <TableCell>Tipo</TableCell>
          <TableCell>Origen</TableCell>
          <TableCell>Destino</TableCell>
        </>
      );
    }
    // Secciones para implementar en el futuro
    switch (location.pathname) {
      case '/empresas':
        return (
          <>
            <TableCell>Razon Social</TableCell>
            <TableCell>CUIT/RUT</TableCell>
            <TableCell>Domicilio Fiscal</TableCell>
            <TableCell>Telefono</TableCell>
            <TableCell>Modificar</TableCell>
            <TableCell>Borrar</TableCell>
          </>
        );
      case '/conductores':
        return (
          <>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>DNI</TableCell>
            <TableCell>Fecha de nacimiento</TableCell>
            <TableCell>Empresa</TableCell>
            <TableCell>Vehiculo asignado</TableCell>
            <TableCell>Acciones</TableCell>
            <TableCell>Modificar</TableCell>
            <TableCell>Borrar</TableCell>
          </>
        );
      case '/depositos':
        return (
          <>
            <TableCell>ID</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Localizacion</TableCell>
            <TableCell>Horarios</TableCell>
            <TableCell>Contacto</TableCell>
            <TableCell>Acciones</TableCell>
            <TableCell>Modificar</TableCell>
            <TableCell>Borrar</TableCell>
          </>
        );
      case '/seguimiento-viaje':
        return (
          <>
            <TableCell>Horario</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Ubicacion</TableCell>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    // Manejo de estados iniciales
    if (!data) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center">
            Cargando datos...
          </TableCell>
        </TableRow>
      );
    }

    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center">
            No hay datos disponibles
          </TableCell>
        </TableRow>
      );
    }

    // Solo implementamos listado-viajes por ahora
    if (location.pathname === '/listado-viajes') {
      return data.map((viaje) => (
        <TableRow key={viaje._id || viaje.numeroViaje} hover>
          <TableCell>{viaje.numeroViaje}</TableCell>
          <TableCell>{viaje.empresaTransportista}</TableCell>
          <TableCell>{viaje.nombreChofer}</TableCell>
          <TableCell>{viaje.patenteVehiculo}</TableCell>
          <TableCell>{viaje.fechaFormateada}</TableCell>
          <TableCell>{viaje.tipoViaje}</TableCell>
          <TableCell>{viaje.origen}</TableCell>
          <TableCell>{viaje.destino}</TableCell>
        </TableRow>
      ));
    }


    // Secciones para implementar en el futuro
    switch (location.pathname) {
      case '/empresas':
        return data.map((empresa) => (
          <TableRow key={empresa._id} hover>
            <TableCell>{empresa.razonSocial}</TableCell>
            <TableCell>{empresa.cuit}</TableCell>
            <TableCell>{empresa.domicilioFiscal}</TableCell>
            <TableCell>{empresa.telefono}</TableCell>
            <TableCell>{/* Modificar */}</TableCell>
            <TableCell>{/* Borrar */}</TableCell>
          </TableRow>
        ));
      case '/conductores':
        return data.map((conductor) => (
          <TableRow key={conductor._id} hover>
            <TableCell>{conductor.nombre}</TableCell>
            <TableCell>{conductor.apellido}</TableCell>
            <TableCell>{conductor.dni}</TableCell>
            <TableCell>{conductor.fechaNacimiento}</TableCell>
            <TableCell>{conductor.empresa}</TableCell>
            <TableCell>{conductor.vehiculoAsignado}</TableCell>
            <TableCell>{/* Modificar */}</TableCell>
            <TableCell>{/* Borrar */}</TableCell>
          </TableRow>
        ));
      case '/depositos':
        return data.map((deposito) => (
          <TableRow key={deposito._id} hover>
            <TableCell>{deposito.id}</TableCell>
            <TableCell>{deposito.tipo}</TableCell>
            <TableCell>{deposito.localizacion}</TableCell>
            <TableCell>{deposito.horarios}</TableCell>
            <TableCell>{deposito.contacto}</TableCell>
            <TableCell>{/* Modificar */}</TableCell>
            <TableCell>{/* Borrar */}</TableCell>
          </TableRow>
        ));
      case '/seguimiento-viaje':
        return data.map((seguimiento) => (
          <TableRow key={seguimiento._id} hover>
            <TableCell>{seguimiento.horario}</TableCell>
            <TableCell>{seguimiento.estado}</TableCell>
            <TableCell>{seguimiento.ubicacion}</TableCell>
          </TableRow>
        ));
      default:
        return null;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {renderTableHeaders()}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderTableRows()}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tabla;