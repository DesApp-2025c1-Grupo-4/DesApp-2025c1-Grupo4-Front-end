import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllChoferes } from '../../services/Choferes/ChoferService'
import Header from '../../commonComponents/Header';
import Paginacion from '../../commonComponents/Paginacion';

export function ListadoChoferes(){

  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  //Content state
  const [choferes, setChoferes] = useState([]);
  //const [newEmpresa, setNewEmpresa] = useState(faldr);
  
  //API Call
  useEffect(() => {
    async function fetchChoferes() {
      try {
        const choferes = await getAllChoferes();
        setChoferes(choferes);
      } catch (error) {
        console.log('ERROR FETCH API [choferes]: ' + error);
      }
    }
    fetchChoferes();
  }, []);
  
  //Adding icons
  let listaCompleta = choferes;
  listaCompleta = listaCompleta.map(chofer => {
    return {
      ...chofer,
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
      id: 'nombre', 
      label: 'Nombre', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'apellido', 
      label: 'Apellido', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'cuil',
      label: 'CUIL',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'fechaNacimiento',
      label: 'Fecha de nacimiento',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'empresa',
      label: 'Empresa',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'asignaciones',
      label: 'Vehículo asignado',
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
    <Header/>
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
        elemento="choferes"
      />
    </Box>   
  </>
};