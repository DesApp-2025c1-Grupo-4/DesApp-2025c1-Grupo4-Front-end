import { useState } from 'react';
import { Box } from '@mui/material';
import  ReusableTable  from '../../components/ReusableTable';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { render } from 'react-dom';

export function EmpresasPage(){

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');

  // Mock data
  const users = [
    { id: 1, razon: 'Nombre empresa 1', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' },
    { id: 2, razon: 'Nombre empresa 2', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' },
    { id: 3, razon: 'Nombre empresa 3', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' },
    { id: 4, razon: 'Nombre empresa 4', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' },
    { id: 5, razon: 'Nombre empresa 5', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' },
    { id: 6, razon: 'Nombre empresa 6', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' }, 
    { id: 7, razon: 'Nombre empresa 7', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' },
    { id: 8, razon: 'Nombre empresa 8', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' },
    { id: 9, razon: 'Nombre empresa 9', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' },
    { id: 10, razon: 'Nombre empresa 10', cuit: '00-00000000-00', domicilio: 'Calle falsa 123', telefono: '00-00000000' },
    // ... more data
  ];

  // Columns configuration
  const columns = [
    { 
      id: 'razon', 
      label: 'Razón Social', 
      sortable: false,
      minWidth: 150 
    },
    { 
      id: 'cuit', 
      label: 'CUIT/RUT', 
      sortable: false,
      minWidth: 200 
    },
    {
      id: 'domicilio',
      label: 'Domicilio Fiscal',
      sortable: false,
      minWidth: 200
    },
    {
      id: 'telefono',
      label: 'Teléfono',
      sortable: false,
      minWidth: 200
    },
    {
      id: 'modificar',
      label: 'Modificar',
      sortable: false,
      minWidth: 200
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      minWidth: 200
    },
    // { 
    //   id: 'status', 
    //   label: 'Status', 
    //   align: 'center',
    //   render: (value) => (
    //     <span style={{ 
    //       color: value === 'Active' ? 'green' : 'red',
    //       fontWeight: 'bold'
    //     }}>
    //       {value}
    //     </span>
    //   )
    // }
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
    data={users}
    page={page}
    rowsPerPage={rowsPerPage}
    totalRows={users.length}
    handleChangePage={handleChangePage}
    handleChangeRowsPerPage={handleChangeRowsPerPage}
    sortDirection={sortDirection}
    sortBy={sortBy}
    onSort={handleSort}
    />
  </Box>   
};