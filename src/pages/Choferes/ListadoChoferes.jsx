import { useState, useEffect } from 'react';
import { Box, IconButton, Grid, InputLabel, TextField } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllChoferes } from '../../services/Choferes/ChoferService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';
import { dateFormat } from '../../helpers/dateFormat';
import Popup from '../../commonComponents/Popup';

export function ListadoChoferes(){
  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedChofer, setSelectedChofer] = useState(null);

  //Content state
  const [choferes, setChoferes] = useState([]);

  //Componente filtro
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: '',
  });
  
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
  
  // Handle popup open
  const handleOpenPopup = (type, chofer = null) => {
    setPopupType(type);
    setSelectedChofer(chofer);
    setPopupOpen(true);
  };

  //Adding icons
  let listaCompleta = choferes.map(chofer => {
    return {
      ...chofer,
      fechaNacimiento: dateFormat(chofer.fechaNacimiento),
      modificar: (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-chofer', chofer)}
          size="small"
        >
          <CreateOutlinedIcon fontSize="small"/>
        </IconButton>
      ),
      eliminar: (
        <IconButton 
          onClick={() => handleOpenPopup('confirmar-eliminar', chofer)}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <CloseOutlinedIcon fontSize="small"/>
        </IconButton>
      )
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
      width: '5%'
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      width: '5%'
    }
  ];

  // Sort handler
  const handleSort = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  return <>
    <Box sx={{py:4, px:15}}>
      <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} mode={'choferes'}/>
      </Box>
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

    {/* Popup*/}
    <Popup
      open={popupOpen}
      onClose={() => setPopupOpen(false)}
      page={popupType}
      selectedItem={selectedChofer}
      buttonName={
        popupType === 'modificar-chofer' ? 'Modificar Chofer' :
        popupType === 'confirmar-eliminar' ? 'Eliminar Chofer' :
        'Aceptar'
      }
    />
  </>
};