import {
  Grid, InputLabel, TextField, Box, Typography, List, ListItem,
  ListItemText, CircularProgress, IconButton, Modal, Button,
  Paper, Select, MenuItem, FormControl, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, Stack
} from '@mui/material';
import { grey, blue } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

const useDebouncedFetch = (url, paramName, value, setData, setLoading, extraParams = {}) => {
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { [paramName]: value, activo: true, ...extraParams };
        const response = await axios.get(url, { params });
        setData(response.data);
      } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (value.length > 2 || value.length === 0) fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [value, JSON.stringify(extraParams)]);
};

const LabeledTextField = ({
  name, label, value, onChange, onBlur, error, readOnly = false, placeholder = '', type = 'text'
}) => (
  <Box sx={{ mb: 2 }}>
    <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
      {label}
    </InputLabel>
    <TextField
      fullWidth
      size="small"
      name={name}
      type={type}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      placeholder={placeholder}
      InputProps={readOnly ? { readOnly: true } : {}}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '& fieldset': {
            borderColor: grey[300]
          }
        }
      }}
    />
    {error && <ErrorText>{error}</ErrorText>}
  </Box>
);

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': {
      borderColor: grey[300]
    }
  }
};

const iconButtonSx = {
  borderRadius: 2,
  border: `1px solid ${grey[300]}`,
  backgroundColor: 'background.paper',
  '&:hover': {
    backgroundColor: grey[100]
  }
};

const DetailModal = ({ open, onClose, title, item, fields }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {fields.map(({ label, value, render }) => (
            <Box key={label}>
              <Typography variant="subtitle2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body1">
                {render ? render(item) : value.split('.').reduce((o, i) => o?.[i], item)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

const SelectionModal = ({
  open,
  onClose,
  title,
  items,
  onSelect,
  searchValue,
  onSearchChange,
  loading,
  getText,
  getSecondaryText,
  getThirdText,
  emptyText,
  icon: Icon,
  detailFields,
  showSearch = true
}) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {Icon && <Icon color="primary" />}
              <Typography variant="h6" color="primary">{title}</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {showSearch && (
            <TextField
              fullWidth
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: grey[500] }} />,
              }}
              sx={{ mb: 2, ...fieldSx }}
            />
          )}

          <Paper elevation={0} sx={{ flex: 1, overflow: 'auto', border: `1px solid ${grey[200]}`, borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : items.length > 0 ? (
              <List dense>
                {items.map((item) => (
                  <ListItem
                    key={item._id}
                    button
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    secondaryAction={
                      detailFields && (
                        <IconButton 
                          edge="end" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setDetailModalOpen(true);
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      )
                    }
                    sx={{
                      '&:hover': {
                        backgroundColor: blue[50]
                      }
                    }}
                  >
                    <ListItemText
                      primary={<Typography fontWeight="medium">{getText(item)}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {getSecondaryText?.(item)}
                          </Typography>
                          {getThirdText && (
                            <Typography variant="body2" color="text.secondary">
                              {getThirdText(item)}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  {emptyText}
                </Typography>
              </Box>
            )}
          </Paper>
        </Paper>
      </Modal>

      {detailFields && (
        <DetailModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Detalle de ${title}`}
          item={selectedItem}
          fields={detailFields}
        />
      )}
    </>
  );
};

const ViajeForm = ({ formData = {}, handleChange, handleBlur, errors, isEditing = false }) => {
  const normalizedFormData = {
    ...formData,
    deposito_origen: formData.depositoOrigen?._id || formData.depositoOrigen,
    deposito_destino: formData.depositoDestino?._id || formData.depositoDestino,
    empresa_transportista: formData.empresaTransportista?._id || formData.empresaTransportista,
    chofer_asignado: formData.choferAsignado?._id || formData.choferAsignado,
    vehiculo_asignado: formData.vehiculoAsignado?._id || formData.vehiculoAsignado,
    tipo_viaje: formData.tipoViaje,
    inicio_viaje: formData.fechaInicio,
    fin_viaje: formData.fechaFin
  };

  const [empresas, setEmpresas] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [depositosOrigen, setDepositosOrigen] = useState([]);
  const [depositosDestino, setDepositosDestino] = useState([]);
  
  const [inputValues, setInputValues] = useState({
    empresa: '', chofer: '', vehiculo: '', depositoOrigen: '', depositoDestino: ''
  });
  
  const [loadingStates, setLoadingStates] = useState({
    empresas: false, choferes: false, vehiculos: false, 
    depositosOrigen: false, depositosDestino: false
  });
  
  const [modalStates, setModalStates] = useState({
    empresas: false, choferes: false, vehiculos: false,
    depositosOrigen: false, depositosDestino: false
  });

  const [vehicleDetailModal, setVehicleDetailModal] = useState({
    open: false,
    item: null
  });

  useEffect(() => {
    if (formData.depositoOrigen?.localizacion?.pais && formData.depositoDestino?.localizacion?.pais) {
      const isNacional = formData.depositoOrigen.localizacion.pais === 'Argentina' && 
                         formData.depositoDestino.localizacion.pais === 'Argentina';
      
      handleChange({ 
        target: { 
          name: 'tipoViaje', 
          value: isNacional ? 'Nacional' : 'Internacional' 
        } 
      });
    }
  }, [formData.depositoOrigen, formData.depositoDestino]);

  useDebouncedFetch(
    '/api/empresas', 
    'nombre', 
    inputValues.empresa, 
    setEmpresas,
    (loading) => setLoadingStates(prev => ({ ...prev, empresas: loading }))
  );

  useDebouncedFetch(
    '/api/choferes',
    'nombre',
    inputValues.chofer,
    setChoferes,
    (loading) => setLoadingStates(prev => ({ ...prev, choferes: loading })),
    { empresa: formData.empresaTransportista?._id }
  );

  useDebouncedFetch(
    '/api/vehiculos',
    'patente',
    inputValues.vehiculo,
    setVehiculos,
    (loading) => setLoadingStates(prev => ({ ...prev, vehiculos: loading })),
    { empresa: formData.empresaTransportista?._id }
  );

  useDebouncedFetch(
    '/api/depositos',
    'direccion',
    inputValues.depositoOrigen,
    setDepositosOrigen,
    (loading) => setLoadingStates(prev => ({ ...prev, depositosOrigen: loading }))
  );

  useDebouncedFetch(
    '/api/depositos',
    'direccion',
    inputValues.depositoDestino,
    setDepositosDestino,
    (loading) => setLoadingStates(prev => ({ ...prev, depositosDestino: loading }))
  );

  useEffect(() => {
    if (isEditing) {
      const fetchInitialData = async () => {
        try {
          if (normalizedFormData.choferAsignado && typeof normalizedFormData.choferAsignado === 'string') {
            const res = await axios.get(`/api/choferes/${normalizedFormData.choferAsignado}`, { params: { activo: true } });
            handleChange({ target: { name: "choferAsignado", value: res.data } });
          }
          if (normalizedFormData.vehiculoAsignado && typeof normalizedFormData.vehiculoAsignado === 'string') {
            const res = await axios.get(`/api/vehiculos/${normalizedFormData.vehiculoAsignado}`, { params: { activo: true } });
            handleChange({ target: { name: "vehiculoAsignado", value: res.data } });
          }
          if (normalizedFormData.empresaTransportista && typeof normalizedFormData.empresaTransportista === 'string') {
            const res = await axios.get(`/api/empresas/${normalizedFormData.empresaTransportista}`, { params: { activo: true } });
            handleChange({ target: { name: "empresaTransportista", value: res.data } });
          }
          if (normalizedFormData.depositoOrigen && typeof normalizedFormData.depositoOrigen === 'string') {
            const res = await axios.get(`/api/depositos/${normalizedFormData.depositoOrigen}`, { params: { activo: true } });
            handleChange({ target: { name: "depositoOrigen", value: res.data } });
          }
          if (normalizedFormData.depositoDestino && typeof normalizedFormData.depositoDestino === 'string') {
            const res = await axios.get(`/api/depositos/${normalizedFormData.depositoDestino}`, { params: { activo: true } });
            handleChange({ target: { name: "depositoDestino", value: res.data } });
          }
        } catch (error) {
          console.error("Error loading initial data:", error);
        }
      };
      fetchInitialData();
    }
  }, [isEditing]);

  const handleInputChange = (key, value) => 
    setInputValues(prev => ({ ...prev, [key]: value }));

  const toggleModal = (key) => 
    setModalStates(prev => ({ ...prev, [key]: !prev[key] }));

  const validateDates = () => {
    if (formData.fechaInicio && formData.fechaFin) {
      const startDate = new Date(formData.fechaInicio);
      const endDate = new Date(formData.fechaFin);
      
      if (startDate >= endDate) {
        setErrors(prev => ({
          ...prev,
          fechaFin: 'La fecha de fin debe ser posterior a la fecha de inicio'
        }));
        return false;
      }
    }
    return true;
  };

  const handleDateChange = (e) => {
    handleChange(e);
    setTimeout(validateDates, 100);
  };

  const handleChoferChange = (chofer) => {
    handleChange({ target: { name: "choferAsignado", value: chofer } });
    if (chofer?.vehiculo_defecto) {
      handleChange({ target: { name: "vehiculoAsignado", value: chofer.vehiculo_defecto } });
      handleInputChange('vehiculo', chofer.vehiculo_defecto.patente);
    } else {
      handleChange({ target: { name: "vehiculoAsignado", value: null } });
      handleInputChange('vehiculo', '');
    }
  };

  const handleEmpresaSelect = (empresa) => {
    if (!empresa?._id) {
      console.error('Empresa seleccionada sin ID:', empresa);
      return;
    }

    handleChange({
      target: {
        name: "empresaTransportista",
        value: empresa
      }
    });

    handleInputChange('empresa', empresa.nombre_empresa);
    
    // Clear driver and vehicle when changing company
    handleChange({ target: { name: "choferAsignado", value: null } });
    handleChange({ target: { name: "vehiculoAsignado", value: null } });
    handleInputChange('chofer', '');
    handleInputChange('vehiculo', '');
  };

  const handleVehiculoChange = (vehiculo) => {
    handleChange({ target: { name: "vehiculoAsignado", value: vehiculo } });
  };

  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    
    try {
      // Handle backend format (DD/MM/YYYY HH:mm)
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart?.split(':') || ['00', '00'];
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      
      // Handle ISO string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const offset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            Información del Viaje
          </Typography>

          <LabeledTextField
            name="fechaInicio"
            label="Fecha y Hora de Inicio"
            type="datetime-local"
            value={formatForDateTimeLocal(normalizedFormData.fechaInicio)}
            onChange={handleDateChange}
            onBlur={handleBlur}
            error={errors.fechaInicio}
            InputLabelProps={{ shrink: true }}
          />

          <LabeledTextField
            name="fechaFin"
            label="Fecha y Hora de Fin"
            type="datetime-local"
            value={formatForDateTimeLocal(normalizedFormData.fechaFin)}
            onChange={handleDateChange}
            onBlur={handleBlur}
            error={errors.fechaFin}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
              Depósito de Origen
            </InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={normalizedFormData.depositoOrigen?.localizacion?.direccion || ''}
                sx={fieldSx}
                InputProps={{
                  readOnly: true,
                  startAdornment: normalizedFormData.depositoOrigen && (
                    <LocationOnIcon sx={{ mr: 1, color: grey[600] }} />
                  ),
                }}
              />
              <IconButton
                onClick={() => toggleModal('depositosOrigen')}
                sx={iconButtonSx}
              >
                <SearchIcon />
              </IconButton>
            </Box>
            {errors.depositoOrigen && <ErrorText>{errors.depositoOrigen}</ErrorText>}
          </Box>

          <SelectionModal
            open={modalStates.depositosOrigen}
            onClose={() => toggleModal('depositosOrigen')}
            title="Seleccionar Depósito de Origen"
            items={depositosOrigen}
            onSelect={(deposito) => {
              handleChange({ target: { name: "depositoOrigen", value: deposito } });
              if (normalizedFormData.depositoDestino?._id === deposito._id) {
                handleChange({ target: { name: "depositoDestino", value: null } });
              }
            }}
            searchValue={inputValues.depositoOrigen}
            onSearchChange={(val) => handleInputChange('depositoOrigen', val)}
            loading={loadingStates.depositosOrigen}
            getText={(item) => item.localizacion?.direccion}
            getSecondaryText={(item) => `${item.localizacion?.ciudad}, ${item.localizacion?.pais}`}
            emptyText="No hay depósitos disponibles"
            icon={LocationOnIcon}
            detailFields={[
              { label: 'Dirección', value: 'localizacion.direccion' },
              { label: 'Ciudad', value: 'localizacion.ciudad' },
              { label: 'Provincia', value: 'localizacion.provincia_estado' },
              { label: 'País', value: 'localizacion.pais' },
              { label: 'Tipo', value: 'tipo' },
              { label: 'Horarios', render: (item) => 
                `${item.horarios?.desde} - ${item.horarios?.hasta} (${item.horarios?.dias?.join(', ')})` 
              }
            ]}
          />

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
              Depósito de Destino
            </InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={normalizedFormData.depositoDestino?.localizacion?.direccion || ''}
                sx={fieldSx}
                InputProps={{
                  readOnly: true,
                  startAdornment: normalizedFormData.depositoDestino && (
                    <LocationOnIcon sx={{ mr: 1, color: grey[600] }} />
                  ),
                }}
              />
              <IconButton
                onClick={() => toggleModal('depositosDestino')}
                sx={iconButtonSx}
              >
                <SearchIcon />
              </IconButton>
            </Box>
            {errors.depositoDestino && <ErrorText>{errors.depositoDestino}</ErrorText>}
          </Box>

          <SelectionModal
            open={modalStates.depositosDestino}
            onClose={() => toggleModal('depositosDestino')}
            title="Seleccionar Depósito de Destino"
            items={depositosDestino.filter(d => d._id !== normalizedFormData.depositoOrigen?._id)}
            onSelect={(deposito) => {
              handleChange({ target: { name: "depositoDestino", value: deposito } });
            }}
            searchValue={inputValues.depositoDestino}
            onSearchChange={(val) => handleInputChange('depositoDestino', val)}
            loading={loadingStates.depositosDestino}
            getText={(item) => item.localizacion?.direccion}
            getSecondaryText={(item) => `${item.localizacion?.ciudad}, ${item.localizacion?.pais}`}
            emptyText="No hay depósitos disponibles"
            icon={LocationOnIcon}
            detailFields={[
              { label: 'Dirección', value: 'localizacion.direccion' },
              { label: 'Ciudad', value: 'localizacion.ciudad' },
              { label: 'Provincia', value: 'localizacion.provincia_estado' },
              { label: 'País', value: 'localizacion.pais' },
              { label: 'Tipo', value: 'tipo' },
              { label: 'Horarios', render: (item) => 
                `${item.horarios?.desde} - ${item.horarios?.hasta} (${item.horarios?.dias?.join(', ')})` 
              }
            ]}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel required sx={{ color: grey[700], fontWeight: 'bold' }}>
              Tipo de Viaje
            </InputLabel>
            <Select
              value={normalizedFormData.tipoViaje || ''}
              onChange={handleChange}
              name="tipoViaje"
              error={!!errors.tipoViaje}
              sx={{
                ...fieldSx,
                '& .MuiSelect-select': {
                  py: 1.2
                }
              }}
              disabled={true}
              IconComponent={() => null}
            >
              <MenuItem value="" disabled>Seleccione un tipo</MenuItem>
              <MenuItem value="Nacional">Nacional</MenuItem>
              <MenuItem value="Internacional">Internacional</MenuItem>
            </Select>
            {errors.tipoViaje && <ErrorText>{errors.tipoViaje}</ErrorText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            Información de Transporte
          </Typography>

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
              Empresa Transportista
            </InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={normalizedFormData.empresaTransportista?.nombre_empresa || ''}
                sx={fieldSx}
                InputProps={{
                  readOnly: true,
                  startAdornment: normalizedFormData.empresaTransportista && (
                    <BusinessIcon sx={{ mr: 1, color: grey[600] }} />
                  ),
                }}
              />
              <IconButton
                onClick={() => toggleModal('empresas')}
                sx={iconButtonSx}
              >
                <SearchIcon />
              </IconButton>
            </Box>
            {errors.empresaTransportista && <ErrorText>{errors.empresaTransportista}</ErrorText>}
          </Box>

          <SelectionModal
            open={modalStates.empresas}
            onClose={() => toggleModal('empresas')}
            title="Seleccionar Empresa Transportista"
            items={empresas}
            onSelect={handleEmpresaSelect}
            searchValue={inputValues.empresa}
            onSearchChange={(val) => handleInputChange('empresa', val)}
            loading={loadingStates.empresas}
            getText={(item) => item.nombre_empresa}
            getSecondaryText={(item) => `CUIT: ${item.cuit}`}
            emptyText="No hay empresas disponibles"
            icon={BusinessIcon}
            detailFields={[
              { label: 'Nombre', value: 'nombre_empresa' },
              { label: 'CUIT', value: 'cuit' },
              { label: 'Teléfono', value: 'datos_contacto.telefono' },
              { label: 'Email', value: 'datos_contacto.mail' },
              { label: 'Dirección', render: (item) => 
                `${item.domicilio_fiscal?.direccion}, ${item.domicilio_fiscal?.ciudad}, ${item.domicilio_fiscal?.provincia_estado}, ${item.domicilio_fiscal?.pais}`
              }
            ]}
          />

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
              Chofer Asignado
            </InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={
                  !normalizedFormData.choferAsignado ? '' :
                    `${normalizedFormData.choferAsignado.nombre} ${normalizedFormData.choferAsignado.apellido}`
                }
                sx={fieldSx}
                InputProps={{
                  readOnly: true,
                  startAdornment: normalizedFormData.choferAsignado && (
                    <PersonIcon sx={{ mr: 1, color: grey[600] }} />
                  ),
                }}
              />
              <IconButton
                onClick={() => toggleModal('choferes')}
                sx={iconButtonSx}
                disabled={!formData.empresaTransportista}
              >
                <SearchIcon />
              </IconButton>
            </Box>
            {errors.choferAsignado && <ErrorText>{errors.choferAsignado}</ErrorText>}
          </Box>

          <SelectionModal
            open={modalStates.choferes}
            onClose={() => toggleModal('choferes')}
            title="Seleccionar Chofer"
            items={choferes}
            onSelect={handleChoferChange}
            searchValue={inputValues.chofer}
            onSearchChange={(val) => handleInputChange('chofer', val)}
            loading={loadingStates.choferes}
            getText={(item) => `${item.nombre} ${item.apellido}`}
            getSecondaryText={(item) => `CUIL: ${item.cuil}`}
            getThirdText={(item) => item.vehiculo_defecto ? `Vehículo: ${item.vehiculo_defecto.patente}` : 'Sin vehículo asignado'}
            emptyText="No hay choferes disponibles"
            icon={PersonIcon}
            detailFields={[
              { label: 'Nombre', value: 'nombre' },
              { label: 'Apellido', value: 'apellido' },
              { label: 'CUIL', value: 'cuil' },
              { label: 'Empresa', value: 'empresa.nombre_empresa' },
              { label: 'Vehículo Asignado', render: (item) => 
                item.vehiculo_defecto ? `${item.vehiculo_defecto.patente} - ${item.vehiculo_defecto.marca} ${item.vehiculo_defecto.modelo}` : 'Ninguno'
              },
              { label: 'Licencia', render: (item) => 
                item.licenciaNumero ? `${item.licenciaNumero} (${item.licenciaTipo?.join(', ') || 'Sin tipo'})` : 'Sin licencia registrada'
              },
              { label: 'Fecha Expiración Licencia', render: (item) => 
                item.licenciaExpiracion ? new Date(item.licenciaExpiracion).toLocaleDateString() : 'No especificada'
              }
            ]}
          />

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
              Vehículo Asignado
            </InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={
                  !normalizedFormData.vehiculoAsignado ? '' :
                    `${normalizedFormData.vehiculoAsignado.patente}`
                }
                sx={fieldSx}
                InputProps={{
                  readOnly: true,
                  startAdornment: normalizedFormData.vehiculoAsignado && (
                    <DirectionsCarIcon sx={{ mr: 1, color: grey[600] }} />
                  ),
                }}
              />
              {!normalizedFormData.choferAsignado?.vehiculo_defecto ? (
                <IconButton
                  onClick={() => toggleModal('vehiculos')}
                  sx={iconButtonSx}
                >
                  <SearchIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setVehicleDetailModal({
                      open: true,
                      item: normalizedFormData.vehiculoAsignado
                    });
                  }}
                  sx={iconButtonSx}
                >
                  <InfoIcon />
                </IconButton>
              )}
            </Box>
            {errors.vehiculoAsignado && <ErrorText>{errors.vehiculoAsignado}</ErrorText>}
          </Box>

          <SelectionModal
            open={modalStates.vehiculos}
            onClose={() => toggleModal('vehiculos')}
            title="Seleccionar Vehículo"
            items={vehiculos}
            onSelect={handleVehiculoChange}
            searchValue={inputValues.vehiculo}
            onSearchChange={(val) => handleInputChange('vehiculo', val)}
            loading={loadingStates.vehiculos}
            getText={(item) => `${item.patente} - ${item.marca} ${item.modelo}`}
            getSecondaryText={(item) => item.empresa ? `Empresa: ${item.empresa.nombre_empresa}` : 'Sin empresa'}
            getThirdText={(item) => `Capacidad: ${item.capacidad_carga?.volumen}m³ / ${item.capacidad_carga?.peso}kg`}
            emptyText="No hay vehículos disponibles"
            icon={DirectionsCarIcon}
            detailFields={[
              { label: 'Patente', value: 'patente' },
              { label: 'Marca', value: 'marca' },
              { label: 'Modelo', value: 'modelo' },
              { label: 'Año', value: 'anio' },
              { label: 'Tipo', value: 'tipo_vehiculo' },
              { label: 'Empresa', value: 'empresa.nombre_empresa' },
              { label: 'Capacidad', render: (item) => 
                `${item.capacidad_carga?.volumen}m³ / ${item.capacidad_carga?.peso}kg`
              }
            ]}
          />
        </Grid>
      </Grid>

      {/* Modal de detalle del vehículo */}
      <DetailModal
        open={vehicleDetailModal.open}
        onClose={() => setVehicleDetailModal({...vehicleDetailModal, open: false})}
        title="Detalle de Vehículo"
        item={vehicleDetailModal.item}
        fields={[
          { label: 'Patente', value: 'patente' },
          { label: 'Marca', value: 'marca' },
          { label: 'Modelo', value: 'modelo' },
          { label: 'Año', value: 'anio' },
          { label: 'Tipo', value: 'tipo_vehiculo' },
          { label: 'Empresa', value: 'empresa.nombre_empresa' },
          { label: 'Capacidad', render: (item) => 
            `${item.capacidad_carga?.volumen}m³ / ${item.capacidad_carga?.peso}kg`
          }
        ]}
      />
    </Box>
  );
};

export default ViajeForm;