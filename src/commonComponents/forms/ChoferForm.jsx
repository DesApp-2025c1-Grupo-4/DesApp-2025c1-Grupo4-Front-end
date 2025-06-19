import {
  Grid, InputLabel, TextField, Autocomplete, Box, Typography, List, ListItem,
  ListItemText, CircularProgress, IconButton, Divider, Modal, Button,
  Paper, Avatar
} from '@mui/material';
import { grey, blue, indigo } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import axios from 'axios';

const useDebouncedFetch = (url, paramName, value, setData, setLoading) => {
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          params: { [paramName]: value }
        });
        setData(response.data);
      } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (value.length > 2 || value.length === 0) {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);
};

const LabeledTextField = ({
  name, label, value, onChange, onBlur, error, readOnly = false, placeholder = ''
}) => (
  <Box sx={{ mb: 2 }}>
    <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
      {label}
    </InputLabel>
    <TextField
      fullWidth
      size="small"
      name={name}
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

const SearchAutocomplete = ({
  label, placeholder, value, inputValue, onInputChange, onChange,
  options, getOptionLabel, loading, error, noOptionsText
}) => {
  const getResolvedValue = () => {
    if (!value || typeof value !== 'string') return value || null;
    return options.find(opt => opt._id === value) || null;
  };

  return (
    <>
      <InputLabel sx={{
        color: grey[700],
        fontWeight: 'bold',
        mb: 0.5
      }}>
        {label}
      </InputLabel>
      <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        inputValue={inputValue || ''}
        onInputChange={(_, newValue) => onInputChange(newValue)}
        value={getResolvedValue()}
        onChange={(_, newValue) => onChange(newValue || null)}
        loading={loading}
        isOptionEqualToValue={(option, value) => option?._id === value?._id}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            size="small"
            margin="dense"
            error={!!error}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText={noOptionsText}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </>
  );
};

const SelectionModal = ({
  open, onClose, title, items, onSelect, searchValue, onSearchChange,
  loading, getText, getSecondaryText, emptyText, icon: Icon
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
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: grey[500] }} />,
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            overflow: 'auto',
            border: `1px solid ${grey[200]}`,
            borderRadius: 2
          }}
        >
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
                    primary={
                      <Typography fontWeight="medium">
                        {getText(item)}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {getSecondaryText?.(item)}
                      </Typography>
                    }
                    sx={{ my: 0 }}
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

const ChoferForm = ({
  formData, handleChange, handleBlur, errors,
  empresas: empresasIniciales = [], vehiculos = [], isEditing = false
}) => {
  const [empresas, setEmpresas] = useState(empresasIniciales);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(vehiculos);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState(vehiculos);
  const [inputValues, setInputValues] = useState({
    empresa: '', vehiculo: ''
  });
  const [loadingStates, setLoadingStates] = useState({
    empresas: false, vehiculos: false
  });
  const [modalStates, setModalStates] = useState({
    empresas: false, vehiculos: false
  });

  useEffect(() => {
    if (formData.empresa?._id) {
      setVehiculosFiltrados(
        vehiculosDisponibles.filter(v => v.empresa?._id === formData.empresa._id)
      );
    } else {
      setVehiculosFiltrados(vehiculosDisponibles);
    }
  }, [formData.empresa, vehiculosDisponibles]);

  useDebouncedFetch(
    '/api/empresas',
    'nombre',
    inputValues.empresa,
    setEmpresas,
    (loading) => setLoadingStates(prev => ({ ...prev, empresas: loading }))
  );

  useDebouncedFetch(
    '/api/vehiculos',
    'patente',
    inputValues.vehiculo,
    setVehiculosDisponibles,
    (loading) => setLoadingStates(prev => ({ ...prev, vehiculos: loading }))
  );

  const handleInputChange = (key, value) =>
    setInputValues(prev => ({ ...prev, [key]: value }));

  const toggleModal = (key) =>
    setModalStates(prev => ({ ...prev, [key]: !prev[key] }));

  const handleVehiculoChange = (vehiculo) => {
    handleChange({ target: { name: "vehiculoAsignado", value: vehiculo } });
    if (vehiculo?.empresa) {
      handleChange({ target: { name: "empresa", value: vehiculo.empresa } });
      handleInputChange('empresa', vehiculo.empresa.nombre_empresa);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2 }}>
        {isEditing && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
            pt: 1,
          }}>
            <Avatar sx={{ bgcolor: indigo[100] }}>
              <PersonIcon color="primary" />
            </Avatar>
            <Typography variant="h6" color="primary">
              Modificar Chofer: {formData.nombre} {formData.apellido}
            </Typography>
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
              Información personal
            </Typography>

            {['nombre', 'apellido', 'cuil'].map((field) => (
              <LabeledTextField
                key={field}
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[field]}
                placeholder={field === 'cuil' ? 'XX-XXXXXXXX-X' : ''}
                readOnly={field === 'cuil' && isEditing}
              />
            ))}

            <Box sx={{ mb: 2 }}>
              <InputLabel required sx={{
                color: grey[700],
                fontWeight: 'bold',
                mb: 0.5
              }}>
                Fecha de Nacimiento
              </InputLabel>
              <DatePicker
                value={formData.fechaNacimiento || null}
                onChange={(date) => handleChange({ target: { name: 'fechaNacimiento', value: date } })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    error={!!errors.fechaNacimiento}
                    sx={fieldSx}
                  />
                )}
              />
              {errors.fechaNacimiento && <ErrorText>{errors.fechaNacimiento}</ErrorText>}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
              Información laboral
            </Typography>

            <Box sx={{ mb: 2 }}>
              <InputLabel required sx={{
                color: grey[700],
                fontWeight: 'bold',
                mb: 0.5
              }}>
                Empresa
              </InputLabel>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.empresa?.nombre_empresa || ''}
                  sx={fieldSx}
                  InputProps={{
                    readOnly: true,
                    startAdornment: formData.empresa && (
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
              {errors.empresa && <ErrorText>{errors.empresa}</ErrorText>}
            </Box>

            <SelectionModal
              open={modalStates.empresas}
              onClose={() => toggleModal('empresas')}
              title="Seleccionar Empresa"
              items={empresas}
              onSelect={(empresa) => {
                handleChange({ target: { name: "empresa", value: empresa } });
                if (formData.vehiculoAsignado && formData.vehiculoAsignado.empresa?._id !== empresa._id) {
                  handleChange({ target: { name: "vehiculoAsignado", value: null } });
                }
              }}
              searchValue={inputValues.empresa}
              onSearchChange={(val) => handleInputChange('empresa', val)}
              loading={loadingStates.empresas}
              getText={(item) => item.nombre_empresa}
              getSecondaryText={(item) => item.cuit && `CUIT: ${item.cuit}`}
              emptyText="No hay empresas disponibles"
              icon={BusinessIcon}
            />

            <Box sx={{ mb: 2 }}>
              <InputLabel sx={{
                color: grey[700],
                fontWeight: 'bold',
                mb: 0.5
              }}>
                Vehículo Asignado
              </InputLabel>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={
                    !formData.vehiculoAsignado ? '-- Sin asignar --' :
                      `${formData.vehiculoAsignado.patente} - ${formData.vehiculoAsignado.marca} ${formData.vehiculoAsignado.modelo}`
                  }
                  sx={fieldSx}
                  InputProps={{
                    readOnly: true,
                    startAdornment: formData.vehiculoAsignado && (
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
              items={[{ _id: 'null', patente: '-- Sin asignar --', marca: '', modelo: '' }, ...vehiculosFiltrados]}
              onSelect={(vehiculo) => handleVehiculoChange(vehiculo._id === 'null' ? null : vehiculo)}
              searchValue={inputValues.vehiculo}
              onSearchChange={(val) => handleInputChange('vehiculo', val)}
              loading={loadingStates.vehiculos}
              getText={(item) => item.patente === '-- Sin asignar --' ? item.patente : `${item.patente} - ${item.marca} ${item.modelo}`}
              getSecondaryText={(item) => item.empresa?.nombre_empresa && `Empresa: ${item.empresa.nombre_empresa}`}
              emptyText={formData.empresa ? "No hay vehículos disponibles para esta empresa" : "No hay vehículos disponibles"}
              icon={DirectionsCarIcon}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default ChoferForm;
