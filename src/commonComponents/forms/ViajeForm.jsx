import {
  Grid, InputLabel, TextField, Autocomplete, Box, Typography, List, ListItem,
  ListItemText, CircularProgress, IconButton, Divider, Modal, Button,
  Paper, Avatar, Select, MenuItem, FormControl
} from '@mui/material';
import { grey, blue, indigo } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const useDebouncedFetch = (url, paramName, value, setData, setLoading) => {
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, { params: { [paramName]: value } });
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
  }, [value]);
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
  emptyText,
  icon: Icon
}) => {
  return (
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
                  sx={{
                    '&:hover': {
                      backgroundColor: blue[50]
                    }
                  }}
                >
                  <ListItemText
                    primary={<Typography fontWeight="medium">{getText(item)}</Typography>}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {getSecondaryText?.(item)}
                      </Typography>
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

        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            mt: 2,
            alignSelf: 'flex-end',
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Cancelar
        </Button>
      </Paper>
    </Modal>
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

  // Estados para búsquedas
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

  // Configuración de búsquedas
  const searchConfigs = [
    { key: 'empresas', url: '/api/empresas', param: 'nombre', inputKey: 'empresa' },
    { key: 'choferes', url: '/api/choferes', param: 'nombre', inputKey: 'chofer' },
    { key: 'vehiculos', url: '/api/vehiculos', param: 'patente', inputKey: 'vehiculo' },
    { key: 'depositosOrigen', url: '/api/depositos', param: 'direccion', inputKey: 'depositoOrigen' },
    { key: 'depositosDestino', url: '/api/depositos', param: 'direccion', inputKey: 'depositoDestino' }
  ];

  // Configurar debounced fetch para cada búsqueda
  searchConfigs.forEach(({ key, url, param, inputKey }) => {
    useDebouncedFetch(
      url, 
      param, 
      inputValues[inputKey], 
      key === 'depositosOrigen' ? setDepositosOrigen : 
      key === 'depositosDestino' ? setDepositosDestino :
      key === 'choferes' ? setChoferes :
      key === 'vehiculos' ? setVehiculos : setEmpresas,
      (loading) => setLoadingStates(prev => ({ ...prev, [key]: loading }))
    );
  });

  // Cargar datos iniciales para edición
  useEffect(() => {
    if (isEditing && normalizedFormData.choferAsignado && typeof normalizedFormData.choferAsignado === 'string') {
      const fetchInitialData = async () => {
        try {
          const res = await axios.get(`/api/choferes/${normalizedFormData.choferAsignado}`);
          handleChange({ target: { name: "choferAsignado", value: res.data } });
        } catch (error) {
          console.error("Error cargando datos iniciales:", error);
        }
      };
      fetchInitialData();
    }
  }, [isEditing]);

  const handleInputChange = (key, value) => 
    setInputValues(prev => ({ ...prev, [key]: value }));

  const toggleModal = (key) => 
    setModalStates(prev => ({ ...prev, [key]: !prev[key] }));

  const handleChoferChange = (chofer) => {
  handleChange({ target: { name: "choferAsignado", value: chofer } });
  // Verificar si el chofer tiene vehículo asignado
  if (chofer?.vehiculo_defecto) {
    handleChange({ target: { name: "vehiculoAsignado", value: chofer.vehiculo_defecto } });
    handleInputChange('vehiculo', chofer.vehiculo_defecto.patente);
    if (chofer.vehiculo_defecto.empresa) {
      handleChange({ target: { name: "empresaTransportista", value: chofer.vehiculo_defecto.empresa } });
      handleInputChange('empresa', chofer.vehiculo_defecto.empresa.nombre_empresa);
    }
  } else {
    // Limpiar vehículo si el chofer no tiene uno asignado
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
      value: empresa  // ← aquí está el fix
    }
  });

  handleInputChange('empresa', empresa.nombre_empresa);
};

  const handleVehiculoChange = (vehiculo) => {
    handleChange({ target: { name: "vehiculoAsignado", value: vehiculo } });
    if (vehiculo?.empresa) {
      handleChange({ target: { name: "empresaTransportista", value: vehiculo.empresa } });
      handleInputChange('empresa', vehiculo.empresa.nombre_empresa);
    }
  };

  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    try {
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart?.split(':') || ['00', '00'];
        const date = new Date(year, month - 1, day, hours, minutes);
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const offset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
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
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.fechaInicio}
            InputLabelProps={{ shrink: true }}
          />

          <LabeledTextField
            name="fechaFin"
            label="Fecha y Hora de Fin"
            type="datetime-local"
            value={formatForDateTimeLocal(normalizedFormData.fechaFin)}
            onChange={handleChange}
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
            getThirdText={(item) => `Capacidad: ${item.capacidad}`}
            emptyText="No hay depósitos disponibles"
            icon={LocationOnIcon}
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
            getThirdText={(item) => `Capacidad: ${item.capacidad}`}
            emptyText="No hay depósitos disponibles"
            icon={LocationOnIcon}
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
            onSelect={handleEmpresaSelect}  // Usamos la nueva función aquí
            searchValue={inputValues.empresa}
            onSearchChange={(val) => handleInputChange('empresa', val)}
            loading={loadingStates.empresas}
            getText={(item) => item.nombre_empresa}
            getSecondaryText={(item) => `CUIT: ${item.cuit}`}
            emptyText="No hay empresas disponibles"
            icon={BusinessIcon}
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
                    `${normalizedFormData.choferAsignado.nombre} ${normalizedFormData.choferAsignado.apellido}` +
                    (normalizedFormData.choferAsignado.vehiculoAsignado ? 
                      ` (${normalizedFormData.choferAsignado.vehiculoAsignado.patente})` : '')
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
            getThirdText={(item) => item.vehiculoAsignado ? `Vehículo: ${item.vehiculoAsignado.patente}` : 'Sin vehículo asignado'}
            emptyText="No hay choferes disponibles"
            icon={PersonIcon}
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
              <IconButton
                onClick={() => toggleModal('vehiculos')}
                sx={iconButtonSx}
              >
                <SearchIcon />
              </IconButton>
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
            getThirdText={(item) => `Capacidad: ${item.capacidad}`}
            emptyText="No hay vehículos disponibles"
            icon={DirectionsCarIcon}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViajeForm;