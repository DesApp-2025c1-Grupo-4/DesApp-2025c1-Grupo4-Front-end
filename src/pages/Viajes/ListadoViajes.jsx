import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import  ReusableTable  from '../../components/ReusableTable';

export function ListadoViajesPage(){

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');

  // Mock data
  const trips = [
    { numero: 'PV-124', empresa: 'Transporte Sur', chofer: 'M. López', vehiculo: 'DEF456',
      fechaInicio: '2025-08-21', tipo: 'Internacional', origen: 'Mendoza', destino: 'Santiago' },
    {
      numero: 'PV-125', empresa: 'Cargas Norte', chofer: 'C. Gómez', vehiculo: 'GHI789',
      fechaInicio: '2025-08-22', tipo: 'Nacional', origen: 'Salta', destino: 'Rosario'
    },
    {
      numero: 'PV-126', empresa: 'Logística Andina', chofer: 'S. Martínez', vehiculo: 'JKL321',
      fechaInicio: '2025-08-23', tipo: 'Internacional', origen: 'San Juan', destino: 'Valparaíso'
    },
    {
      numero: 'PV-127', empresa: 'Ruta Federal', chofer: 'L. Fernández', vehiculo: 'MNO654',
      fechaInicio: '2025-08-24', tipo: 'Nacional', origen: 'La Plata', destino: 'M. del Plata'
    },
    // ... more data
  ];

  // Columns configuration
  const columns = [
    { 
      id: 'numero', 
      label: 'Número de Viaje', 
      sortable: false,
      minWidth: 140 
    },
    { 
      id: 'empresa', 
      label: 'Empresa', 
      sortable: false,
      minWidth: 150
    },
    {
      id: 'chofer',
      label: 'Chofer',
      sortable: false,
      minWidth: 150
    },
    {
      id: 'vehiculo',
      label: 'Vehículo',
      sortable: false,
      minWidth: 150
    },
    {
      id: 'fechaInicio',
      label: 'Fecha inicio',
      sortable: false,
      minWidth: 150
    },
    {
      id: 'tipo',
      label: 'Tipo de Viaje',
      sortable: false,
      minWidth: 150
    },
    {
      id: 'origen',
      label: 'Origen',
      sortable: false,
      minWidth: 150
    },
    {
      id: 'destino',
      label: 'Destino',
      sortable: false,
      minWidth: 150
    },
  ];

  // Sort handler
  const handleSort = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
    // Here you would typically call your API with new sort parameters
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Here you would typically call your API with new page
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    // Here you would typically call your API with new page size
  };

  return <Box sx={{py:4}}>
    <ReusableTable
    columns={columns}
    data={trips}
    page={page}
    rowsPerPage={rowsPerPage}
    totalRows={trips.length}
    handleChangePage={handleChangePage}
    handleChangeRowsPerPage={handleChangeRowsPerPage}
    sortDirection={sortDirection}
    sortBy={sortBy}
    onSort={handleSort}
    />
  </Box>   
};