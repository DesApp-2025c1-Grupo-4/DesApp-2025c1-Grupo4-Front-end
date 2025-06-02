import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';

const Tabla = ({ viajes }) => {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Numero</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Empresa Transportista</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Chofer</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vehiculo</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Origen</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Destino</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {viajes.map((viaje) => (
            <TableRow key={viaje._id} hover>
              <TableCell>{viaje.numeroViaje}</TableCell>
              <TableCell>{viaje.empresaTransportista}</TableCell>
              <TableCell>{viaje.nombreChofer}</TableCell>
              <TableCell>{viaje.patenteVehiculo}</TableCell>
              <TableCell>{viaje.fechaFormateada}</TableCell>
              <TableCell>{viaje.tipoViaje}</TableCell>
              <TableCell>{viaje.origen}</TableCell>
              <TableCell>{viaje.destino}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tabla;