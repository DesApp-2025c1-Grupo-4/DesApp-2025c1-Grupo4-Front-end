import { useState, useEffect } from 'react';
import { 
  Box, InputLabel, TextField, Select, MenuItem, FormControl, 
  Button, Typography, Stack, IconButton, Modal, Divider, Tooltip, Paper
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import SelectionModal from '../formsComponents/SelectionModal';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Close from '@mui/icons-material/Close';
import FieldContainer from '../formsComponents/FieldContainer';
import { getViajes, updateViajeState } from '../../services/Viajes/ViajeServices';

const ESTADOS_VIAJE = [
  { value: "planificado", label: "Planificado" },
  { value: "en transito", label: "En tránsito" },
  { value: "completado", label: "Completado" },
  { value: "demorado", label: "Demorado" },
  { value: "incidente", label: "Incidente" },
  { value: "cancelado", label: "Cancelado" }
];

const SeguimientoForm = ({ formData, handleChange, handleSubmit, errors, onFinalizar }) => {
  const [estadoActual, setEstadoActual] = useState('');
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModal, setDetailModal] = useState({ open: false, title: '', content: null });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    if (modalOpen) {
      fetchViajes(searchTerm);
    }
  }, [modalOpen, searchTerm]);

  const handleEstadoChange = (e) => {
    setEstadoActual(e.target.value);
    // Limpiar mensajes cuando el usuario cambia el estado
    setSuccessMessage('');
    setErrorMessage('');
  };

const actualizarEstadoViaje = async () => {
  console.log("Estado a enviar:", estadoActual);
  if (!estadoActual || !formData.idViaje) {
    setErrorMessage('Debe seleccionar un viaje y un estado');
    return;
  }

  try {
    setLoading(true);
    setErrorMessage('');
    
    await updateViajeState(formData.idViaje, estadoActual);
    
    setSuccessMessage('Estado actualizado correctamente');
    fetchViajes(searchTerm);
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
          <Typography><strong>Número:</strong> {viaje.numeroViaje || viaje._id}</Typography>
          <Typography><strong>Empresa:</strong> {viaje.empresaTransportista || 'Sin empresa'}</Typography>
          <Typography><strong>Chofer:</strong> {viaje.nombreChofer || 'Sin chofer'}</Typography>
          <Typography><strong>Vehículo:</strong> {viaje.patenteVehiculo || 'Sin vehículo'}</Typography>
          <Typography><strong>Origen:</strong> {viaje.origen || 'Sin origen'}</Typography>
          <Typography><strong>Destino:</strong> {viaje.destino || 'Sin destino'}</Typography>
          <Typography><strong>Estado actual:</strong> {viaje.estado || 'planificado'}</Typography>
        </Box>
      )
    });
  };

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
                backgroundColor: 'primary.main', 
                color: 'white',
                width: 40,
                height: 40,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.1)',
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)'
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Search sx={{ fontSize: '1.2rem' }} />
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
        <Box sx={{ mt: 3, mb: 3 }}>
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
      )}
    </>
  );
};

export default SeguimientoForm;