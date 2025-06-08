import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllEmpresas } from '../../services/Empresas/EmpresaService';
import Paginacion from '../../commonComponents/Paginacion';

export function ListadoEmpresas(){

  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

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
  
  //Adding icons
  let listaCompleta = empresas;
  listaCompleta = listaCompleta.map(empresa => {
    return {
      ...empresa,
      modificar: <IconButton variant="tableButtons"><CreateOutlinedIcon variant="tableButtons"/></IconButton>,
      eliminar: <IconButton variant="tableButtons"><CloseOutlinedIcon variant="tableButtons"/></IconButton>
    };
  });

  //Parametros para paginado
  const PaginaActual = (pagina) => {
    return listaCompleta.slice(
      (pagina - 1) * itemsPorPagina,
      pagina * itemsPorPagina
    );
  };

  // Columns configuration
  const columns = [
    { 
      id: 'razonSocial', 
      label: 'Razón Social', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'cuit', 
      label: 'CUIT/RUT', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'domicilio',
      label: 'Domicilio Fiscal',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'contacto',
      label: 'Teléfono',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'modificar',
      label: 'Modificar',
      sortable: false,
      minWidth: 50
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      minWidth: 50
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
    <Box sx={{py:4, px:10}}>
      <Tabla2
        columns={columns}
        data={PaginaActual(pagina)}
        sortDirection={sortDirection}
        sortBy={sortBy}
        onSort={handleSort}
      />
      <Paginacion
        pagina={pagina}
        setPagina={setPagina}
        totalItems={listaCompleta.length}
        itemsPorPagina={itemsPorPagina}
        elemento="empresas"
      />
    </Box>   
  </>
};