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

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const response = await axios.get('/api/viajes', {
          params: {
            populate: 'empresa_asignada,chofer_asignado,vehiculo_asignado,deposito_origen,deposito_destino',
            activo: true
          }
        });

        const datosTransformados = response.data.map(item => ({
          ...item,
          guid_viaje: item.guid_vieje || item._id,
          numeroViaje: item.guid_vieje?.toString() || item._id?.toString() || 'N/A',
          empresaTransportista: item.empresa_asignada?.nombre_empresa || 'Sin empresa',
          nombreChofer: `${item.chofer_asignado?.nombre || ''} ${item.chofer_asignado?.apellido || ''}`.trim() || 'Sin chofer',
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

  useEffect(() => {
    const filtered = viajes.filter(viaje => {
      // Search filter (mantener igual)
      
      // Date filter
      if (filtros.fechaDesde) {
        const fechaInicioStr = viaje.inicio_viaje;
        if (!fechaInicioStr || fechaInicioStr === 'Sin fecha') return false;
        
        try {
          const [datePart, timePart] = fechaInicioStr.split(' ');
          const [day, month, year] = datePart.split('/');
          const fechaInicio = new Date(`${year}-${month}-${day}`);
          const filtroDesde = new Date(filtros.fechaDesde);
          
          if (fechaInicio < filtroDesde) return false;
        } catch {
          return false;
        }
      }
      
      if (filtros.fechaHasta) {
        const fechaFinStr = viaje.fin_viaje;
        if (!fechaFinStr || fechaFinStr === 'Sin fecha') return false;
        
        try {
          const [datePart, timePart] = fechaFinStr.split(' ');
          const [day, month, year] = datePart.split('/');
          const fechaFin = new Date(`${year}-${month}-${day}`);
          const filtroHasta = new Date(filtros.fechaHasta);
          
          if (fechaFin > filtroHasta) return false;
        } catch {
          return false;
        }
      }
      
      return true;
    });
    
    setViajesFiltrados(filtered);
    setPagina(1);
  }, [filtros, viajes]);

  const handleClear = () => {
    setFiltros({ 
      criterio: 'Empresa transportista', 
      fechaDesde: '', 
      fechaHasta: '', 
      busqueda: '' 
    });
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
        const response = await axios.get(`/api/viajes/${viaje._id}`, {
          params: { 
            populate: 'deposito_origen,deposito_destino,empresa_asignada,chofer_asignado,vehiculo_asignado',
            activo: true
          }
        });
        
        setSelectedViaje({
          _id: response.data._id,
          depositoOrigen: response.data.deposito_origen,
          depositoDestino: response.data.deposito_destino,
          fechaInicio: response.data.inicio_viaje,
          fechaFin: response.data.fin_viaje,
          empresaTransportista: response.data.empresa_asignada,
          choferAsignado: response.data.chofer_asignado,
          vehiculoAsignado: response.data.vehiculo_asignado,
          tipoViaje: response.data.tipo_viaje
        });
      } catch (error) {
        console.error('Error loading viaje data:', error);
      }
    } else if (type === 'nuevo-viaje') {
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
    } else if (type === 'confirmar-eliminar') {
      setSelectedViaje(viaje);
    }
    
    setPopupOpen(true);
  };

const handleDeleteViaje = async (id) => {
  try {
    setIsLoadingAction(true);

    await axios.patch(`/api/viajes/${id}`, {
      estado: 'cancelado',
    });

    setViajes(prev => prev.filter(v => v._id !== id));
    setViajesFiltrados(prev => prev.filter(v => v._id !== id));

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
      
      const convertToBackendFormat = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return '';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      };

      const payload = {
        deposito_origen: viajeActualizado.depositoOrigen?._id || viajeActualizado.depositoOrigen,
        deposito_destino: viajeActualizado.depositoDestino?._id || viajeActualizado.depositoDestino,
        inicio_viaje: convertToBackendFormat(viajeActualizado.fechaInicio),
        fin_viaje: convertToBackendFormat(viajeActualizado.fechaFin),
        empresa_asignada: viajeActualizado.empresaTransportista?._id || viajeActualizado.empresaTransportista,
        chofer_asignado: viajeActualizado.choferAsignado?._id || viajeActualizado.choferAsignado,
        vehiculo_asignado: viajeActualizado.vehiculoAsignado?._id || viajeActualizado.vehiculoAsignado,
        tipo_viaje: viajeActualizado.tipoViaje,
        estado: 'planificado'
      };
      
      await axios.put(`/api/viajes/${viajeActualizado._id}`, payload);
      
      const response = await axios.get('/api/viajes', {
        params: {
          populate: 'empresa_asignada,chofer_asignado,vehiculo_asignado,deposito_origen,deposito_destino',
          activo: true
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

  const handleCreateViaje = async (nuevoViaje) => {
    try {
      setIsLoadingAction(true);
      
      const camposRequeridos = {
        depositoOrigen: 'Depósito origen',
        depositoDestino: 'Depósito destino',
        empresaTransportista: 'Empresa transportista',
        choferAsignado: 'Chofer asignado',
        vehiculoAsignado: 'Vehículo asignado'
      };

      for (const [campo, nombre] of Object.entries(camposRequeridos)) {
        if (!nuevoViaje[campo]?._id) {
          throw new Error(`Debe seleccionar un ${nombre} válido`);
        }
      }

      const convertToBackendFormat = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return '';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      };

      const payload = {
        deposito_origen: nuevoViaje.depositoOrigen._id,
        deposito_destino: nuevoViaje.depositoDestino._id,
        inicio_viaje: convertToBackendFormat(nuevoViaje.fechaInicio),
        fin_viaje: convertToBackendFormat(nuevoViaje.fechaFin),
        empresa_asignada: nuevoViaje.empresaTransportista._id,
        chofer_asignado: nuevoViaje.choferAsignado._id,
        vehiculo_asignado: nuevoViaje.vehiculoAsignado._id,
        tipo_viaje: nuevoViaje.tipoViaje || 
                   (nuevoViaje.depositoOrigen?.localizacion?.pais === 'Argentina' && 
                    nuevoViaje.depositoDestino?.localizacion?.pais === 'Argentina' ? 'Nacional' : 'Internacional'),
        estado: 'planificado',
        activo: true
      };

      await axios.post('/api/viajes', payload);
      
      const response = await axios.get('/api/viajes', {
        params: { 
          populate: 'empresa_asignada,chofer_asignado,vehiculo_asignado,deposito_origen,deposito_destino',
          activo: true
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
      
      setSnackbarMessage('Viaje creado correctamente');
      setSnackbarOpen(true);
      setPopupOpen(false);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setSnackbarMessage(error.response?.data?.mensaje || error.message);
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
        onSuccess={popupType === 'modificar-viaje' ? handleUpdateViaje : 
                  popupType === 'nuevo-viaje' ? handleCreateViaje : null}
        onDelete={popupType === 'confirmar-eliminar' ? handleDeleteViaje : null}
        buttonName={
          popupType === 'modificar-viaje' ? 'Guardar Cambios' :
          popupType === 'nuevo-viaje' ? 'Crear Viaje' :
          popupType === 'confirmar-eliminar' ? 'Eliminar Viaje' :
          'Aceptar'
        }
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
          onSearch={() => setFiltros(prev => ({...prev}))}
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