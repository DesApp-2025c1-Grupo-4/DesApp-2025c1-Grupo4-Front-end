import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton, Snackbar } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import ViajeForm from '../../commonComponents/forms/ViajeForm';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';

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
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Sin fecha') return 'Sin fecha';
    
    try {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      
      const date = new Date(year, month - 1, day, hours, minutes);
      
      return isNaN(date.getTime()) 
        ? 'Fecha inválida' 
        : date.toLocaleString('es-AR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', '');
    } catch {
      return 'Fecha inválida';
    }
  };

  // Obtener viajes del backend
  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const response = await axios.get('/api/viajes', {
          params: {
            populate: 'empresa_asignada,chofer_asignado,vehiculo_asignado,deposito_origen,deposito_destino'
          }
        });

        const datosTransformados = response.data.map(item => ({
          ...item,
          guid_viaje: item.guid_vieje || item._id,
          numeroViaje: item.guid_vieje?.toString() || item._id?.toString() || 'N/A',
          empresaTransportista: item.empresa_asignada?.nombre_empresa || 'Sin empresa',
          nombreChofer: `${item.chofer_asignado?.nombre || ''} ${item.chofer_asignado?.apellido || ''}`.trim() || 'Sin chofer',
          // Añadir esta línea para incluir el vehículo asignado del chofer
          vehiculoChofer: item.chofer_asignado?.vehiculo_defecto?.patente || 'Sin vehículo',
          patenteVehiculo: item.vehiculo_asignado?.patente || item.chofer_asignado?.vehiculo_defecto?.patente || 'Sin patente',
          fechaInicio: formatDate(item.inicio_viaje),
          fechaFin: formatDate(item.fin_viaje),
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

  const handleOpenPopup = async (type, viaje = null) => {
  setPopupType(type);
  
  if (type === 'modificar-viaje' && viaje) {
    try {
      // Obtener datos frescos del viaje (sin populate adicional)
      const response = await axios.get(`/api/viajes/${viaje._id}`);
      // Usar los datos transformados que ya vienen del listado
      const viajeExistente = viajes.find(v => v._id === viaje._id);
      setSelectedViaje({
      _id: viaje._id,
      depositoOrigen: viaje.deposito_origen?._id || viaje.deposito_origen,
      depositoDestino: viaje.deposito_destino?._id || viaje.deposito_destino,
      fechaInicio: viaje.inicio_viaje,
      fechaFin: viaje.fin_viaje,
      empresaTransportista: viaje.empresa_asignada?._id || viaje.empresa_asignada,
      choferAsignado: viaje.chofer_asignado?._id || viaje.chofer_asignado,
      vehiculoAsignado: viaje.vehiculo_asignado?._id || viaje.vehiculo_asignado,
      tipoViaje: viaje.tipo_viaje
    });
    } catch (error) {
      console.error('Error al cargar datos del viaje:', error);
      // Usar datos locales como fallback
      setSelectedViaje({
        _id: viaje._id,
        depositoOrigen: viaje.deposito_origen,
        depositoDestino: viaje.deposito_destino,
        fechaInicio: viaje.inicio_viaje,
        fechaFin: viaje.fin_viaje,
        empresaTransportista: viaje.empresa_asignada,
        choferAsignado: viaje.chofer_asignado,
        vehiculoAsignado: viaje.vehiculo_asignado,
        tipoViaje: viaje.tipo_viaje
      });
    }
  } else {
    setSelectedViaje({
      idViaje: '',
      depositoOrigen: null,
      depositoDestino: null,
      fechaInicio: '',
      fechaFin: '',
      empresaTransportista: null,
      choferAsignado: null,
      vehiculoAsignado: null,
      tipoViaje: ''
    });
  }
  
  setPopupOpen(true);
};

  const handleDeleteViaje = async () => {
    try {
      setIsLoadingAction(true);
      await axios.patch(`/api/viajes/${selectedViaje._id}/delete`);
      
      setViajes(prev => prev.filter(v => v._id !== selectedViaje._id));
      setViajesFiltrados(prev => prev.filter(v => v._id !== selectedViaje._id));
      
      setSnackbarMessage('Viaje eliminado correctamente');
      setSnackbarOpen(true);
      setPopupOpen(false);
    } catch (error) {
      console.error('Error al eliminar viaje:', error);
      setSnackbarMessage('Error al eliminar el viaje');
      setSnackbarOpen(true);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleUpdateViaje = async (viajeActualizado) => {
    try {
      setIsLoadingAction(true);
      await axios.put(`/api/viajes/${viajeActualizado._id}`, viajeActualizado);
      
      // Actualizar el listado
      const response = await axios.get('/api/viajes', {
        params: {
          populate: 'empresa_asignada,chofer_asignado,vehiculo_asignado,deposito_origen,deposito_destino'
        }
      });

      const datosTransformados = response.data.map(item => ({
        ...item,
        guid_viaje: item.guid_vieje || item._id,
        numeroViaje: item.guid_vieje?.toString() || item._id?.toString() || 'N/A',
        empresaTransportista: item.empresa_asignada?.nombre_empresa || 'Sin empresa',
        nombreChofer: `${item.chofer_asignado?.nombre || ''} ${item.chofer_asignado?.apellido || ''}`.trim() || 'Sin chofer',
        patenteVehiculo: item.vehiculo_asignado?.patente || 'Sin patente',
        fechaInicio: formatDate(item.inicio_viaje),
        fechaFin: formatDate(item.fin_viaje),
        tipo_viaje: item.tipo_viaje || 
                   (item.deposito_origen?.localizacion?.pais === 'Argentina' && 
                    item.deposito_destino?.localizacion?.pais === 'Argentina' ? 'Nacional' : 'Internacional'),
        origen: item.deposito_origen?.localizacion?.direccion || 'Sin origen',
        destino: item.deposito_destino?.localizacion?.direccion || 'Sin destino',
        estado: item.estado || 'planificado'
      }));

      setViajes(datosTransformados);
      setViajesFiltrados(datosTransformados);
      
      setSnackbarMessage('Viaje actualizado correctamente');
      setSnackbarOpen(true);
      setPopupOpen(false);
    } catch (error) {
      console.error('Error al actualizar viaje:', error);
      setSnackbarMessage('Error al actualizar el viaje');
      setSnackbarOpen(true);
    } finally {
      setIsLoadingAction(false);
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
      render: (value) => value
    },
    { 
      id: 'fechaFin', 
      label: 'Fecha Fin', 
      minWidth: 120, 
      align: 'left',
      render: (value) => value
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
          disabled={isLoadingAction}
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
          disabled={isLoadingAction}
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
        onConfirm={popupType === 'confirmar-eliminar' ? handleDeleteViaje : null}
        onSubmit={popupType === 'modificar-viaje' ? handleUpdateViaje : null}
        buttonName={
          popupType === 'modificar-viaje' ? 'Guardar Cambios' :
          popupType === 'confirmar-eliminar' ? 'Eliminar Viaje' :
          'Aceptar'
        }
        message={popupType === 'confirmar-eliminar' ? '¿Está seguro que desea eliminar este viaje?' : ''}
        isLoading={isLoadingAction}
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