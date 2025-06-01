import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';

const Tabla = ({ viajes }) => {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Número de viaje</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Empresa Transportista</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Conductor</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Patente</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Origen</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Destino</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {viajes.map((viaje, index) => (
            <TableRow key={index} hover>
              <TableCell>{viaje.numero}</TableCell>
              <TableCell>{viaje.transporte}</TableCell>
              <TableCell>{viaje.conductor}</TableCell>
              <TableCell>{viaje.patente}</TableCell>
              <TableCell>{viaje.fecha}</TableCell>
              <TableCell>{viaje.tipo}</TableCell>
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