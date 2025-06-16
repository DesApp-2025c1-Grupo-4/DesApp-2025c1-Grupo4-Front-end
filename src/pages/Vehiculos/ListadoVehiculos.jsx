import { useState, useEffect } from 'react';
import { Box, IconButton, Grid, InputLabel, TextField } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllVehiculos } from '../../services/Vehiculos/VehiculoService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';
import Popup from '../../commonComponents/Popup';

export function ListadoVehiculos(){
  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false); // Nuevo estado

  // Content state
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);

  // Filtro state
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: '',
  });
  
  // API Call
  useEffect(() => {
    async function fetchVehiculos() {
      try {
        const vehiculos = await getAllVehiculos();
        setVehiculos(vehiculos);
        setVehiculosFiltrados(vehiculos);
      } catch (error) {
        console.log('ERROR FETCH API [vehiculos]: ' + error);
      }
    }
    fetchVehiculos();
  }, []);

  // Función de búsqueda
  const handleSearch = () => {
    if (!filtros.busqueda) {
      setVehiculosFiltrados(vehiculos);
      return;
    }

    const resultados = vehiculos.filter(vehiculo => {
      const patenteNormalizada = vehiculo.patente?.replace(/\s/g, '').toLowerCase() || '';
      const busquedaNormalizada = filtros.busqueda.replace(/\s/g, '').toLowerCase();
      return patenteNormalizada.includes(busquedaNormalizada);
    });

    setVehiculosFiltrados(resultados);
    setPagina(1);
  };

  const handleClear = () => {
    setVehiculosFiltrados(vehiculos); 
    setPagina(1);
  };
  
  // Handle popup open
  const handleOpenPopup = async (type, vehiculo = null) => {
    setSelectedVehiculo(vehiculo);
    setPopupType(type);
    setIsDataReady(false);
    
    // Pequeño delay para asegurar que el estado se actualizó
    await new Promise(resolve => setTimeout(resolve, 50));
    setIsDataReady(true);
    setPopupOpen(true);
  };

  // Adding icons
  let listaCompleta = vehiculosFiltrados.map(vehiculo => {
    return {
      ...vehiculo,
      capacidad: `${vehiculo.volumen}m³ - ${vehiculo.peso}kg`,
      modificar: (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-vehiculo', vehiculo)}
          size="small"
        >
          <CreateOutlinedIcon fontSize="small"/>
        </IconButton>
      ),
      eliminar: (
        <IconButton 
          onClick={() => handleOpenPopup('confirmar-eliminar', vehiculo)}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <CloseOutlinedIcon fontSize="small"/>
        </IconButton>
      ),
    };
  });

  // Parametros para paginado
  const PaginaActual = (pagina) => {
    return listaCompleta.slice(
      (pagina - 1) * itemsPorPagina,
      pagina * itemsPorPagina
    );
  };

  // Columns configuration
  const columns = [
    { id: 'patente', 
      label: 'Patente', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'marca', 
      label: 'Marca', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'modelo',
      label: 'Modelo',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'año',
      label: 'Año',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'capacidad',
      label: 'Capacidad',
      sortable: false,
      minWidth: 50
    },
    {
      id: 'tipoVehiculo',
      label: 'Tipo de vehiculo',
      sortable: false,
      minWidth: 50
    },
    {
      id: 'empresa',
      label: 'Empresa',
      sortable: false,
      minWidth: 50
    },
    {
      id: 'modificar',
      label: 'Modificar',
      sortable: false,
      minWidth: 50,
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      minWidth: 50,
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
          <Filtro 
            filtros={filtros} 
            setFiltros={setFiltros} 
            mode={'vehiculos'}
            onSearch={handleSearch}
            onClear={handleClear} 
          />
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
        elemento="vehiculos"
      />
    </Box>

    {/* Popup */}
    {isDataReady && (
      <Popup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        page={popupType}
        selectedItem={selectedVehiculo}
        buttonName={
          popupType === 'modificar-vehiculo' ? 'Modificar Vehículo' :
          popupType === 'confirmar-eliminar' ? 'Eliminar Vehículo' :
          'Aceptar'
        }
      />
    )}
  </>
};