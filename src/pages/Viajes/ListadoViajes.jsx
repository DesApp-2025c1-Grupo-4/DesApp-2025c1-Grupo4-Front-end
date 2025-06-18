import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton, Snackbar } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';
import ViajeForm from '../../commonComponents/forms/ViajeForm';

const ListadoDeViajes = () => {
  const [filtros, setFiltros] = useState({
    criterio: 'Empresa transportista',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });
  const [pagina, setPagina] = useState(1);
  const [itemsPorPagina] = useState(10);
  const [viajes, setViajes] = useState([]);
  const [viajesFiltrados, setViajesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedViaje, setSelectedViaje] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Función para formatear fechas
  const formatForDateTimeLocal = (dateString) => {
    if (!dateString || dateString === 'Sin fecha') return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const offset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  };

  // Obtener viajes del backend
  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const response = await axios.get('/api/viajes');
        const datosTransformados = response.data.map(item => ({
          ...item,
          guid_viaje: item.guid_vieje || item._id,
          numeroViaje: item.guid_vieje?.toString() || item._id?.toString() || 'N/A',
          empresaTransportista: item.empresa_asignada?.nombre_empresa || 'Sin empresa',
          nombreChofer: `${item.chofer_asignado?.nombre || ''} ${item.chofer_asignado?.apellido || ''}`.trim() || 'Sin chofer',
          patenteVehiculo: item.vehiculo_asignado?.patente || 'Sin patente',
          fechaInicio: item.inicio_viaje || 'Sin fecha',
          fechaFin: item.fin_viaje || 'Sin fecha',
          tipo_viaje: item.tipo_viaje || 
                     (item.deposito_origen?.localizacion?.pais === 'Argentina' && 
                      item.deposito_destino?.localizacion?.pais === 'Argentina' ? 'Nacional' : 'Internacional'),
          origen: item.deposito_origen?.localizacion?.direccion || 'Sin origen',
          destino: item.deposito_destino?.localizacion?.direccion || 'Sin destino',
          estado: item.estado || 'planificado'
        }));

        setViajes(datosTransformados);
        setViajesFiltrados(datosTransformados);
      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
        console.error('Error fetching viajes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchViajes();
  }, []);

  // Filtrar viajes
  useEffect(() => {
    const filtered = viajes.filter(viaje => {
      if (!filtros.busqueda) return true;
      
      const searchTerm = filtros.busqueda.toLowerCase();
      switch (filtros.criterio) {
        case 'Empresa transportista':
          return (viaje.empresaTransportista || '').toLowerCase().includes(searchTerm);
        case 'Chofer':
          return (viaje.nombreChofer || '').toLowerCase().includes(searchTerm);
        case 'Vehículo':
          return (viaje.patenteVehiculo || '').toLowerCase().includes(searchTerm);
        default:
          return true;
      }
    });
    setViajesFiltrados(filtered);
    setPagina(1);
  }, [filtros, viajes]);

  const handleClear = () => {
    setFiltros({ criterio: 'Empresa transportista', fechaDesde: '', fechaHasta: '', busqueda: '' });
    setViajesFiltrados(viajes);
    setPagina(1);
  };

  const viajesPaginaActual = () => {
    const inicio = (pagina - 1) * itemsPorPagina;
    return viajesFiltrados.slice(inicio, inicio + itemsPorPagina);
  };

  const handleOpenPopup = async (type, viaje) => {
    try {
      setPopupOpen(false);
      setIsLoadingDetails(true);
      
      // Obtener datos detallados del viaje
      const response = await axios.get(`/api/viajes/${viaje.guid_viaje || viaje._id}`);
      
      // Preparar los datos para el formulario
      const viajeDetallado = {
        guid_viaje: response.data.guid_vieje || response.data._id,
        depositoOrigen: response.data.deposito_origen || null,
        depositoDestino: response.data.deposito_destino || null,
        empresaTransportista: response.data.empresa_asignada || null,
        choferAsignado: response.data.chofer_asignado || null,
        vehiculoAsignado: response.data.vehiculo_asignado || null,
        fechaInicio: formatForDateTimeLocal(response.data.inicio_viaje),
        fechaFin: formatForDateTimeLocal(response.data.fin_viaje),
        tipoViaje: response.data.tipo_viaje || 
                  (response.data.deposito_origen?.localizacion?.pais === 'Argentina' && 
                   response.data.deposito_destino?.localizacion?.pais === 'Argentina' ? 'Nacional' : 'Internacional')
      };

      setSelectedViaje(viajeDetallado);
      setPopupType(type);
      setPopupOpen(true);
    } catch (error) {
      console.error('Error al obtener detalles del viaje:', error);
      setSnackbarMessage('Error al cargar los detalles del viaje');
      setSnackbarOpen(true);
      
      // Usar datos locales si falla la API
      const viajeDetallado = {
        guid_viaje: viaje.guid_viaje || viaje._id,
        depositoOrigen: viaje.deposito_origen || null,
        depositoDestino: viaje.deposito_destino || null,
        empresaTransportista: viaje.empresa_asignada || null,
        choferAsignado: viaje.chofer_asignado || null,
        vehiculoAsignado: viaje.vehiculo_asignado || null,
        fechaInicio: formatForDateTimeLocal(viaje.inicio_viaje),
        fechaFin: formatForDateTimeLocal(viaje.fin_viaje),
        tipoViaje: viaje.tipo_viaje || viaje.tipoViaje
      };
      
      setSelectedViaje(viajeDetallado);
      setPopupType(type);
      setPopupOpen(true);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const columns = [
    { id: 'numeroViaje', label: 'Número', minWidth: 80, align: 'left' },
    { id: 'empresaTransportista', label: 'Empresa', minWidth: 150, align: 'left' },
    { id: 'nombreChofer', label: 'Chofer', minWidth: 120, align: 'left' },
    { id: 'patenteVehiculo', label: 'Vehículo', minWidth: 100, align: 'left' },
    { 
      id: 'fechaInicio', 
      label: 'Fecha Inicio', 
      minWidth: 120, 
      align: 'left',
      render: (value) => value && value !== 'Sin fecha' ? new Date(value).toLocaleString() : 'Sin fecha'
    },
    { 
      id: 'fechaFin', 
      label: 'Fecha Fin', 
      minWidth: 120, 
      align: 'left',
      render: (value) => value && value !== 'Sin fecha' ? new Date(value).toLocaleString() : 'Sin fecha'
    },
    { id: 'tipo_viaje', label: 'Tipo', minWidth: 100, align: 'left' },
    { id: 'origen', label: 'Origen', minWidth: 150, align: 'left' },
    { id: 'destino', label: 'Destino', minWidth: 150, align: 'left' },
    {
      id: 'modificar', 
      label: 'Modificar', 
      minWidth: 80, 
      align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-viaje', row)} 
          size="small" 
          color="primary"
        >
          <CreateOutlinedIcon fontSize="small" />
        </IconButton>
      )
    },
    {
      id: 'eliminar', 
      label: 'Eliminar', 
      minWidth: 80, 
      align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('confirmar-eliminar', row)} 
          size="small" 
          color="error"
        >
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>
      )
    }
  ];

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Popup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        page={popupType}
        selectedItem={selectedViaje}
        FormComponent={popupType === 'modificar-viaje' ? ViajeForm : null}
        buttonName={
          popupType === 'modificar-viaje' ? 'Guardar Cambios' :
          popupType === 'confirmar-eliminar' ? 'Eliminar Viaje' :
          'Aceptar'
        }
        message={popupType === 'confirmar-eliminar' ? '¿Está seguro que desea eliminar este viaje?' : ''}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      <Box mb={4}>
        <Filtro 
          filtros={filtros} 
          setFiltros={setFiltros} 
          mode="viajes"
          onClear={handleClear}
          onBuscar={() => setFiltros(prev => ({...prev}))}
        />
      </Box>

      <Box sx={{ width: '85vw', marginLeft: 'calc(-43vw + 50%)', marginRight: 'calc(-40vw + 50%)', overflowX: 'hidden' }}>
        <Tabla2 columns={columns} data={viajesPaginaActual()} sx={{ tableLayout: 'auto', width: '100%' }} />
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