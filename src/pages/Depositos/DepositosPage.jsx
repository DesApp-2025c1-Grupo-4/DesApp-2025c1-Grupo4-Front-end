import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import  ReusableTable  from '../../components/ReusableTable';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Warehouse } from '@mui/icons-material';

export function DepositosPage(){

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');

  // Mock data
  let warehouses = [
    { id: '1', tipo: 'Tercerizado', localizacion: 'Calle falsa 123', horarios: '08:00 - 18:00', contacto: 'Juan Perez'},
    { id: '2', tipo: 'Tercerizado', localizacion: 'Calle falsa 123', horarios: '08:00 - 18:00', contacto: 'Juan Perez'},
    { id: '3', tipo: 'Tercerizado', localizacion: 'Calle falsa 123', horarios: '08:00 - 18:00', contacto: 'Juan Perez'},
    { id: '4', tipo: 'Tercerizado', localizacion: 'Calle falsa 123', horarios: '08:00 - 18:00', contacto: 'Juan Perez'},
    // ... more data
  ];

  //Adding icons
  warehouses = warehouses.map(warehouse => {
    return {
      ...warehouse,
      modificar: <IconButton variant="tableButtons"><CreateOutlinedIcon variant="tableButtons"/></IconButton>,
      eliminar: <IconButton variant="tableButtons"><CloseOutlinedIcon variant="tableButtons"/></IconButton>
    };
  });

  // Columns configuration
  const columns = [
    { 
      id: 'id', 
      label: 'ID', 
      sortable: false,
      minWidth: 140 
    },
    { 
      id: 'tipo', 
      label: 'Tipo', 
      sortable: false,
      minWidth: 200 
    },
    {
      id: 'localizacion',
      label: 'Localización',
      sortable: false,
      minWidth: 200
    },
    {
      id: 'horarios',
      label: 'Horarios',
      sortable: false,
      minWidth: 200
    },
    {
      id: 'contacto',
      label: 'Contacto',
      sortable: false,
      minWidth: 200
    },
    {
      id: 'modificar',
      label: 'Modificar',
      sortable: false,
      minWidth: 140
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      minWidth: 140
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
    data={warehouses}
    page={page}
    rowsPerPage={rowsPerPage}
    totalRows={warehouses.length}
    handleChangePage={handleChangePage}
    handleChangeRowsPerPage={handleChangeRowsPerPage}
    sortDirection={sortDirection}
    sortBy={sortBy}
    onSort={handleSort}
    />
  </Box>   
};