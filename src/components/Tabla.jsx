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
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Origen</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Destino</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {viajes.map((viaje) => (
            <TableRow key={viaje._id} hover>
              <TableCell>{viaje.numeroViaje || `PV - ${viaje._id}`}</TableCell>
              <TableCell>{viaje.transportista?.nombre}</TableCell>
              <TableCell>
                {viaje.conductor ? `${viaje.conductor.nombre} ${viaje.conductor.apellido}` : 'No asignado'}
              </TableCell>
              <TableCell>{viaje.vehiculo?.patente || '----'}</TableCell>
              <TableCell>
                {new Date(viaje.inicioViaje).toLocaleDateString('es-AR')}
              </TableCell>
              <TableCell>{viaje.estado}</TableCell>
              <TableCell>{viaje.depositoOrigen?.nombre}</TableCell>
              <TableCell>{viaje.depositoDestino?.nombre}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tabla;