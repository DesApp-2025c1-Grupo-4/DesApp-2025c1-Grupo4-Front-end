import { useState } from 'react';
import { Box, Container, CircularProgress, Alert, Stack, Button, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import { useViajesData } from '../../hooks/useViajesData';
import { useViajesFiltrados } from '../../hooks/useViajesFiltrados';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { grey } from "@mui/material/colors";

const ListadoDeViajes = () => {
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });
  const [pagina, setPagina] = useState(1);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedViaje, setSelectedViaje] = useState(null);
  
  const { viajes, loading, error } = useViajesData();
  const { viajesFiltrados, viajesPaginaActual, itemsPorPagina } = useViajesFiltrados(viajes, filtros);

  const handleOpenPopup = (type, viaje = null) => {
    setPopupType(type);
    setSelectedViaje(viaje);
    setPopupOpen(true);
  };

  // Configuración de columnas optimizada para ancho completo
  const columns = [
    { 
      id: 'numeroViaje', 
      label: 'Número', 
      sortable: false,
      width: '8%' 
    },
    { 
      id: 'empresaTransportista', 
      label: 'Empresa', 
      sortable: false,
      width: '15%'
    },
    {
      id: 'nombreChofer',
      label: 'Chofer',
      sortable: false,
      width: '12%'
    },
    {
      id: 'patenteVehiculo',
      label: 'Vehículo',
      sortable: false,
      width: '10%'
    },
    {
      id: 'fechaFormateada',
      label: 'Fecha',
      sortable: false,
      width: '10%'
    },
    {
      id: 'tipoViaje',
      label: 'Tipo',
      sortable: false,
      width: '10%'
    },
    {
      id: 'origen',
      label: 'Origen',
      sortable: false,
      width: '15%'
    },
    {
      id: 'destino',
      label: 'Destino',
      sortable: false,
      width: '15%'
    },
    {
      id: 'modificar',
      label: 'Modificar',
      sortable: false,
      width: '5%',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-viaje', row)}
          size="small"
        >
          <CreateOutlinedIcon fontSize="small"/>
        </IconButton>
      )
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      width: '5%',
      render: () => (
        <IconButton size="small">
          <CloseOutlinedIcon fontSize="small"/>
        </IconButton>
      )
    }
  ];

  // Estilos para la tabla
  const tableStyles = {
    container: {
      width: '100%',
      overflowX: 'auto',
      '& .MuiTableCell-root': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '8px 12px'
      }
    },
    headerRow: {
      backgroundColor: grey[200],
      '& .MuiTableCell-head': {
        fontWeight: 'bold',
        fontSize: '0.875rem'
      }
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}> 
      {/* Popup */}
      <Popup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        page={popupType}
        selectedItem={selectedViaje}
        buttonName={
          popupType === 'registrar-viaje' ? 'Registrar Viaje' :
          popupType === 'modificar-viaje' ? 'Modificar Viaje' :
          'Seguimiento'
        }
      />

      {/* Filtro y tabla */}
      <Box mb={4}>
        <Filtro filtros={filtros} setFiltros={setFiltros} mode={"viajes"}/>
      </Box>
      
      <Box sx={tableStyles.container}>
        <Tabla2
          columns={columns}
          data={viajesPaginaActual(pagina)}
          sortDirection="asc"
          sortBy=""
          onSort={() => {}}
          sx={{ tableLayout: 'fixed' }} // Fuerza el ancho fijo
        />
      </Box>
      
      <Paginacion
        pagina={pagina}
        setPagina={setPagina}
        totalItems={viajesFiltrados.length}
        itemsPorPagina={itemsPorPagina}
        elemento="viajes"
      />
    </Container>
  );
};

export default ListadoDeViajes;