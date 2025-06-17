import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
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
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const response = await axios.get('/api/viajes');

        const datosTransformados = response.data.map(item => {
          const paisOrigen = item.deposito_origen?.localizacion?.pais || '';
          const paisDestino = item.deposito_destino?.localizacion?.pais || '';
          const esNacional = paisOrigen === 'Argentina' && paisDestino === 'Argentina';

          return {
            ...item,
            numeroViaje: item.guid_viaje?.toString() || 'N/A',
            empresaTransportista: item.empresa_asignada?.nombre_empresa || 'Sin empresa',
            nombreChofer: `${item.chofer_asignado?.nombre || ''} ${item.chofer_asignado?.apellido || ''}`.trim() || 'Sin chofer',
            patenteVehiculo: item.vehiculo_asignado?.patente || 'Sin patente',
            fechaInicio: item.inicio_viaje || 'Sin fecha',
            fechaFin: item.fin_viaje || 'Sin fecha',
            tipoViaje: esNacional ? 'Nacional' : 'Internacional',
            origen: item.deposito_origen?.localizacion?.direccion || 'Sin origen',
            destino: item.deposito_destino?.localizacion?.direccion || 'Sin destino',
            estado: item.estado || 'planificado'
          };
        });

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
    aplicarFiltros();
  }, [filtros, viajes]);

  const aplicarFiltros = () => {
    const filtered = viajes.filter(viaje => {
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
  };

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
  console.log('Fecha original del API:', {
    inicio_viaje: viaje.inicio_viaje,
    fin_viaje: viaje.fin_viaje
  });

  try {
    const response = await axios.get(`/api/viajes/${viaje.guid_viaje}`);
    const viajeDetallado = {
      ...response.data,
      empresaTransportista: response.data.empresa_asignada?.nombre_empresa,
      nombreChofer: `${response.data.chofer_asignado?.nombre || ''} ${response.data.chofer_asignado?.apellido || ''}`.trim(),
      patenteVehiculo: response.data.vehiculo_asignado?.patente,
      fechaInicio: formatForDateTimeLocal(response.data.inicio_viaje),
      fechaFin: formatForDateTimeLocal(response.data.fin_viaje)
    };

    setSelectedViaje(viajeDetallado);
  } catch (error) {
    console.error('Error al obtener detalles del viaje:', error);
    setSelectedViaje(viaje);
  }

  setPopupType(type);
  setIsDataReady(true);
  setPopupOpen(true);
};

  const columns = [
    { id: 'guid_viaje', label: 'Número', minWidth: 80, align: 'left', render: (value) => value?.toString() || 'N/A' },
    { id: 'empresaTransportista', label: 'Empresa', minWidth: 150, align: 'left' },
    { id: 'nombreChofer', label: 'Chofer', minWidth: 120, align: 'left' },
    { id: 'patenteVehiculo', label: 'Vehículo', minWidth: 100, align: 'left' },
    { id: 'fechaInicio', label: 'Fecha Inicio', minWidth: 120, align: 'left' },
    { id: 'fechaFin', label: 'Fecha Fin', minWidth: 120, align: 'left' },
    { id: 'tipoViaje', label: 'Tipo', minWidth: 100, align: 'left' },
    { id: 'origen', label: 'Origen', minWidth: 150, align: 'left' },
    { id: 'destino', label: 'Destino', minWidth: 150, align: 'left' },
    {
      id: 'modificar', label: 'Modificar', minWidth: 80, align: 'center',
      render: (_, row) => <IconButton onClick={() => handleOpenPopup('modificar-viaje', row)} size="small" color="primary"><CreateOutlinedIcon fontSize="small" /></IconButton>
    },
    {
      id: 'eliminar', label: 'Eliminar', minWidth: 80, align: 'center',
      render: (_, row) => <IconButton onClick={() => handleOpenPopup('confirmar-eliminar', row)} size="small" color="error"><CloseOutlinedIcon fontSize="small" /></IconButton>
    }
  ];

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {isDataReady && (
        <Popup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          page={popupType}
          selectedItem={selectedViaje}
          buttonName={
            popupType === 'modificar-viaje' ? 'Modificar Viaje' :
            popupType === 'confirmar-eliminar' ? 'Eliminar Viaje' :
            'Aceptar'
          }
          message={popupType === 'confirmar-eliminar' ? '¿Está seguro que desea eliminar este viaje?' : ''}
        />
      )}

      <Box mb={4}>
        <Filtro 
          filtros={filtros} 
          setFiltros={setFiltros} 
          mode="viajes"
          onClear={handleClear}
          onBuscar={aplicarFiltros}
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
