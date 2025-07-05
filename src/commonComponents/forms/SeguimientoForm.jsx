import { useState, useEffect } from 'react';
import { 
  Box, InputLabel, TextField, Select, MenuItem, FormControl, 
  Button, Typography, Stack, IconButton, Modal, Divider, Tooltip, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import SelectionModal from '../formsComponents/SelectionModal';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Close from '@mui/icons-material/Close';
import FieldContainer from '../formsComponents/FieldContainer';
import { getViajes, updateViajeState } from '../../services/Viajes/ViajeServices';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { format, parse } from 'date-fns';
import api from '../../services/api';
import Paginacion from '../Paginacion';

const ESTADOS_VIAJE = [
  { value: "planificado", label: "Planificado" },
  { value: "en transito", label: "En tránsito" },
  { value: "completado", label: "Completado" },
  { value: "demorado", label: "Demorado" },
  { value: "incidente", label: "Incidente" },
  { value: "cancelado", label: "Cancelado" }
];

const parseFechaHistorial = (fechaStr) => {
  try {
    return parse(fechaStr, 'dd/MM/yyyy HH:mm', new Date());
  } catch (e) {
    return new Date(0); // Retorna fecha mínima si hay error en el parseo
  }
};

const SeguimientoForm = ({ formData, handleChange, handleSubmit, errors, onFinalizar }) => {
  const [estadoActual, setEstadoActual] = useState('');
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModal, setDetailModal] = useState({ open: false, title: '', content: null });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fechaEstado, setFechaEstado] = useState(new Date());
  const [historialEstados, setHistorialEstados] = useState([]);
  const [paginaHistorial, setPaginaHistorial] = useState(1);
  const itemsPorPaginaHistorial = 5;

  const fetchViajes = async (search = '') => {
    setLoading(true);
    try {
      const data = await getViajes({ busqueda: search });
      setViajes(data);
    } catch (error) {
      console.error('Error fetching viajes:', error);
      setErrorMessage('Error al cargar los viajes');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorial = async (idViaje) => {
    try {
      const response = await api.get(`/viajes/${idViaje}/historial`);
      const historialOrdenado = [...response.data].sort((a, b) => {
        const fechaA = parseFechaHistorial(a.fecha);
        const fechaB = parseFechaHistorial(b.fecha);
        return fechaB - fechaA; // Orden descendente (más reciente a más antiguo)
      });
      setHistorialEstados(historialOrdenado || []);
      setPaginaHistorial(1);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      setHistorialEstados([]);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      fetchViajes(searchTerm);
    }
  }, [modalOpen, searchTerm]);

  useEffect(() => {
    if (formData.idViaje) {
      fetchHistorial(formData.idViaje);
      const viajeSeleccionado = viajes.find(v => v._id === formData.idViaje);
      if (viajeSeleccionado) {
        setEstadoActual(viajeSeleccionado.estado || 'planificado');
      }
    }
  }, [formData.idViaje, viajes]);

  const handleEstadoChange = (e) => {
    setEstadoActual(e.target.value);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const actualizarEstadoViaje = async () => {
    if (!estadoActual || !formData.idViaje) {
      setErrorMessage('Debe seleccionar un viaje y un estado');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      
      await updateViajeState(formData.idViaje, { 
        estado: estadoActual,
        fecha: format(fechaEstado, 'dd/MM/yyyy HH:mm') 
      });
      
      setSuccessMessage('Estado actualizado correctamente');
      fetchViajes(searchTerm);
      fetchHistorial(formData.idViaje);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (viaje) => {
    setDetailModal({
      open: true,
      title: `Detalles del Viaje: ${viaje.numeroViaje || viaje._id}`,
      content: (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Información del Viaje</Typography>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={1}>
            <Typography><strong>Número:</strong> {viaje.numeroViaje || viaje._id}</Typography>
            <Typography><strong>Empresa:</strong> {viaje.empresa_asignada?.nombre_empresa || viaje.empresaTransportista || 'Sin empresa'}</Typography>
            <Typography><strong>Chofer:</strong> {viaje.chofer_asignado?.nombre || viaje.nombreChofer || 'Sin chofer'}</Typography>
            <Typography><strong>Vehículo:</strong> {viaje.vehiculo_asignado?.patente || viaje.patenteVehiculo || 'Sin vehículo'}</Typography>
            <Typography><strong>Origen:</strong> {viaje.origen || 'Sin origen'}</Typography>
            <Typography><strong>Destino:</strong> {viaje.destino || 'Sin destino'}</Typography>
            <Typography><strong>Estado actual:</strong> {ESTADOS_VIAJE.find(e => e.value === viaje.estado)?.label || viaje.estado || 'planificado'}</Typography>
          </Stack>
        </Box>
      )
    });
  };

  const historialPaginado = historialEstados.slice(
    (paginaHistorial - 1) * itemsPorPaginaHistorial,
    paginaHistorial * itemsPorPaginaHistorial
  );

  return (
    <>
      <FieldContainer label="Viaje">
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            margin="dense"
            value={formData.numeroViaje || 'Seleccionar viaje...'}
            InputProps={{
              readOnly: true,
              startAdornment: formData.numeroViaje && (
                <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
              )
            }}
          />
          <Tooltip title="Buscar viaje">
            <IconButton 
              onClick={() => setModalOpen(true)}
              sx={{ 
                mt: '-8px',
                backgroundColor: '#FFFFFF',
                color: '#062B60',
                border: '2px solid #062B60',
                borderRadius: '8px',
                width: 50, 
                height: 56,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                '&:hover': {
                  backgroundColor: '#F38F2B',
                  color: '#FFFFFF',
                  borderColor: '#F38F2B',
                  transform: 'scale(1.1)',
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)'
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Search sx={{ fontSize: '2rem' }} /> 
            </IconButton>
          </Tooltip>
        </Box>
      </FieldContainer>

      <SelectionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSearchTerm('');
        }}
        title="Seleccionar Viaje"
        items={viajes}
        onSelect={(viaje) => {
          handleChange({
            target: {
              name: 'idViaje',
              value: viaje._id
            }
          });
          handleChange({
            target: {
              name: 'numeroViaje',
              value: viaje.numeroViaje || viaje._id
            }
          });
          setEstadoActual(viaje.estado || 'planificado');
          setModalOpen(false);
          setSearchTerm('');
        }}
        loading={loading}
        getText={(viaje) => `Viaje #${viaje.numeroViaje || viaje._id}`}
        getSecondaryText={(viaje) => 
          `${viaje.empresa_asignada?.nombre_empresa || 'Sin empresa'} - ${viaje.vehiculo_asignado?.patente || 'Sin vehículo'}`
        }
        emptyText="No hay viajes disponibles"
        icon={DirectionsCarIcon}
        onViewDetails={handleViewDetails}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        hideActions={true}
        hideFooter={true}
      />

      <Modal open={detailModal.open} onClose={() => setDetailModal({ open: false })}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',        
            maxWidth: 400,        
            maxHeight: '90vh',    
            overflowX: 'hidden',  
            overflowY: 'auto',   
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            outline: 'none'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary">{detailModal.title}</Typography>
            <IconButton onClick={() => setDetailModal({ open: false })}>
              <Close />
            </IconButton>
          </Box>
          {detailModal.content}
        </Paper>
      </Modal>

      {formData.idViaje && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Actualizar estado del viaje</Typography>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Estado del viaje</InputLabel>
                  <Select
                    name="estado"
                    value={estadoActual}
                    onChange={handleEstadoChange}
                    label="Estado del viaje"
                  >
                    {ESTADOS_VIAJE.map((estado) => (
                      <MenuItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                  <DateTimePicker
                    label="Fecha y hora del estado"
                    value={fechaEstado}
                    onChange={(newValue) => setFechaEstado(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    ampm={false}
                    inputFormat="dd/MM/yyyy HH:mm"
                    disableFuture
                  />
                </LocalizationProvider>

                <Button 
                  variant="contained" 
                  onClick={() => {
                    actualizarEstadoViaje();
                    if (typeof onFinalizar === 'function') {
                      onFinalizar();
                    }
                  }}
                  disabled={!estadoActual}
                  sx={{ mt: 2 }}
                >
                  Modificar Estado
                </Button>

                {successMessage && (
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    {successMessage}
                  </Typography>
                )}

                {errorMessage && (
                  <Typography color="error.main" sx={{ mt: 1 }}>
                    {errorMessage}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Historial de estados</Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Estado</TableCell>
                      <TableCell align="right">Fecha</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historialPaginado.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          {ESTADOS_VIAJE.find(e => e.value === item.estado)?.label || item.estado}
                        </TableCell>
                        <TableCell align="right">{item.fecha}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Paginacion
                pagina={paginaHistorial}
                setPagina={setPaginaHistorial}
                totalItems={historialEstados.length}
                itemsPorPagina={itemsPorPaginaHistorial}
                elemento="registros"
              />
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default SeguimientoForm;