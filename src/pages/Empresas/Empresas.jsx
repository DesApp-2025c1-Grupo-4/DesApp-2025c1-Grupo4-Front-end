import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllEmpresas } from '../../services/Empresas/EmpresaService';
import Header from '../../commonComponents/Header';

export function Empresas(){

  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');

  //Content state
  const [empresas, setEmpresas] = useState([]);
  //const [newEmpresa, setNewEmpresa] = useState(faldr);

  //API Call
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const empresas = await getAllEmpresas();
        setEmpresas(empresas);
      } catch (error) {
        console.log('ERROR FETCH API [empresas]: ' + error);
      }
    }
    fetchEmpresas();
  }, []);
  
  console.log(empresas)
  //Adding icons
  let listaCompleta = empresas;
  listaCompleta = listaCompleta.map(empresa => {
    return {
      ...empresa,
      modificar: <IconButton variant="tableButtons"><CreateOutlinedIcon variant="tableButtons"/></IconButton>,
      eliminar: <IconButton variant="tableButtons"><CloseOutlinedIcon variant="tableButtons"/></IconButton>
    };
  });

  // Columns configuration
  const columns = [
    { 
      id: 'razonSocial', 
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
      id: 'contacto',
      label: 'Teléfono',
      sortable: false,
      minWidth: 200
    },
    {
      id: 'modificar',
      label: 'Modificar',
      sortable: false,
      minWidth: 150
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
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

  return <>
    <Header/>
    <Box sx={{py:4}}>
      <Tabla2
      columns={columns}
      data={listaCompleta}
      totalRows={empresas.length-2}
      sortDirection={sortDirection}
      sortBy={sortBy}
      onSort={handleSort}
      />
    </Box>   
  </>
};