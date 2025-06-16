import { useState, useEffect } from 'react';
import { Box, IconButton, Grid, TextField, InputLabel } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllDepositos } from '../../services/Depositos/DepositoService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';
import Popup from '../../commonComponents/Popup';

export function ListadoDepositos() {
  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedDeposito, setSelectedDeposito] = useState(null);

  // Content state
  const [depositos, setDepositos] = useState([]);

  // Filtro state
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: '',
  });

  // API Call
  useEffect(() => {
    async function fetchDepositos() {
      try {
        const depositos = await getAllDepositos();
        setDepositos(depositos);
      } catch (error) {
        console.log('ERROR FETCH API [depositos]: ' + error);
      }
    }
    fetchDepositos();
  }, []);

  // Handle popup open
  const handleOpenPopup = (type, deposito = null) => {
    setPopupType(type);
    setSelectedDeposito(deposito);
    setPopupOpen(true);
  };

  // Adding icons and actions
  let listaCompleta = depositos.map(deposito => {
    return {
      ...deposito,
      localizacion: `${deposito.localizacion?.calle} ${deposito.localizacion?.número}`,
      modificar: (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-deposito', deposito)}
          size="small"
        >
          <CreateOutlinedIcon fontSize="small"/>
        </IconButton>
      ),
      eliminar: (
        <IconButton 
          onClick={() => handleOpenPopup('confirmar-eliminar', deposito)}
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

  // Pagination
  const PaginaActual = (pagina) => {
    return listaCompleta.slice(
      (pagina - 1) * itemsPorPagina,
      pagina * itemsPorPagina
    );
  };

  // Columns configuration
  const columns = [
    { 
      id: '_id', 
      label: 'ID', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'tipo', 
      label: 'Tipo', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'localizacion',
      label: 'Localización',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'horarios',
      label: 'Horarios',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'contacto',
      label: 'Contacto',
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

  return (
    <>
      <Box sx={{py:4, px:15}}>
        <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} mode={'depositos'}/>
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
          elemento="depositos"
        />
      </Box>

      {/* Popup */}
      <Popup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        page={popupType}
        selectedItem={selectedDeposito}
        buttonName={
          popupType === 'modificar-deposito' ? 'Modificar Depósito' :
          popupType === 'confirmar-eliminar' ? 'Eliminar Depósito' :
          'Aceptar'
        }
      />
    </>
  );
}