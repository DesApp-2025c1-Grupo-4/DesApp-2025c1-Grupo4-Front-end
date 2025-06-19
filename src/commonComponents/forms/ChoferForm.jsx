import {
  Grid, InputLabel, TextField, Autocomplete, Box, Typography, List, ListItem, 
  ListItemText, CircularProgress, IconButton, Divider, Modal, Button
} from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
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

const SearchAutocomplete = ({
  label, placeholder, value, inputValue, onInputChange, onChange,
  options, getOptionLabel, loading, error, noOptionsText
}) => {
  const getResolvedValue = () => 
    !value ? null : typeof value === 'string' ? options.find(opt => opt._id === value) || null : value;

  return (
    <>
      <InputLabel sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>{label}</InputLabel>
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
            margin="dense"
            error={!!error}
            sx={{ backgroundColor: grey[50] }}
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
  loading, getText, getSecondaryText, emptyText 
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 1,
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
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <TextField
          fullWidth
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar..."
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: grey[500] }} />,
          }}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          border: `1px solid ${grey[300]}`, 
          borderRadius: 1 
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
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
                >
                  <ListItemText 
                    primary={getText(item)} 
                    secondary={getSecondaryText?.(item)} 
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
        </Box>
        
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ mt: 2, alignSelf: 'flex-end' }}
        >
          Cancelar
        </Button>
      </Box>
    </Modal>
  );
};

const ChoferForm = ({
  formData, handleChange, handleBlur, errors,
  empresas: empresasIniciales = [], vehiculos = [], isEditing = false
}) => {
  const [empresas, setEmpresas] = useState(empresasIniciales);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(vehiculos);
  const [inputValues, setInputValues] = useState({
    empresa: '', vehiculo: ''
  });
  const [loadingStates, setLoadingStates] = useState({
    empresas: false, vehiculos: false
  });
  const [modalStates, setModalStates] = useState({
    empresas: false, vehiculos: false
  });

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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {isEditing && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Editando chofer: {formData.nombre} {formData.apellido}
            </Typography>
          )}
          {['nombre', 'apellido', 'cuil'].map((field, i) => (
            <Box key={field} sx={{ mt: i ? 2 : 0 }}>
              <InputLabel required sx={{ 
                color: grey[900], 
                fontWeight: 'bold' 
              }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}*
              </InputLabel>
              <TextField
                fullWidth
                margin="dense"
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors[field]}
                placeholder={field === 'cuil' ? 'XX-XXXXXXXX-X' : ''}
                sx={{ backgroundColor: grey[50] }}
                InputProps={field === 'cuil' && isEditing ? { readOnly: true } : {}}
              />
              {errors[field] && <ErrorText>{errors[field]}</ErrorText>}
            </Box>
          ))}
        </Grid>

        <Grid item xs={6}>
          <InputLabel required sx={{ 
            color: grey[900], 
            fontWeight: 'bold' 
          }}>
            Fecha de Nacimiento*
          </InputLabel>
          <DatePicker
            value={formData.fechaNacimiento || null}
            onChange={(date) => handleChange({ target: { name: 'fechaNacimiento', value: date } })}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                error={!!errors.fechaNacimiento}
                sx={{ backgroundColor: grey[50] }}
              />
            )}
          />
          {errors.fechaNacimiento && <ErrorText>{errors.fechaNacimiento}</ErrorText>}

          <Box sx={{ mt: 2 }}>
            <InputLabel sx={{ color: grey[900], fontWeight: 'bold' }}>Empresa*</InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                margin="dense"
                value={formData.empresa?.nombre_empresa || ''}
                placeholder="Empresa seleccionada"
                sx={{ backgroundColor: grey[50] }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Button 
                variant="outlined" 
                onClick={() => toggleModal('empresas')}
                startIcon={<SearchIcon />}
              >
                Buscar
              </Button>
            </Box>
            {errors.empresa && <ErrorText>{errors.empresa}</ErrorText>}
          </Box>

          <SelectionModal
            open={modalStates.empresas}
            onClose={() => toggleModal('empresas')}
            title="Seleccionar Empresa"
            items={empresas}
            onSelect={(empresa) => handleChange({ target: { name: "empresa", value: empresa } })}
            searchValue={inputValues.empresa}
            onSearchChange={(val) => handleInputChange('empresa', val)}
            loading={loadingStates.empresas}
            getText={(item) => item.nombre_empresa}
            getSecondaryText={(item) => item.cuit && `CUIT: ${item.cuit}`}
            emptyText="No hay empresas disponibles"
          />

          <Box sx={{ mt: 2 }}>
            <InputLabel sx={{ color: grey[900], fontWeight: 'bold' }}>Vehículo Asignado</InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                margin="dense"
                value={
                  !formData.vehiculoAsignado ? '-- Sin asignar --' : 
                  `${formData.vehiculoAsignado.patente} - ${formData.vehiculoAsignado.marca} ${formData.vehiculoAsignado.modelo}`
                }
                placeholder="Vehículo seleccionado"
                sx={{ backgroundColor: grey[50] }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Button 
                variant="outlined" 
                onClick={() => toggleModal('vehiculos')}
                startIcon={<SearchIcon />}
              >
                Buscar
              </Button>
            </Box>
            {errors.vehiculoAsignado && <ErrorText>{errors.vehiculoAsignado}</ErrorText>}
          </Box>

          <SelectionModal
            open={modalStates.vehiculos}
            onClose={() => toggleModal('vehiculos')}
            title="Seleccionar Vehículo"
            items={[{ _id: 'null', patente: '-- Sin asignar --', marca: '', modelo: '' }, ...vehiculosDisponibles]}
            onSelect={(vehiculo) => handleVehiculoChange(vehiculo._id === 'null' ? null : vehiculo)}
            searchValue={inputValues.vehiculo}
            onSearchChange={(val) => handleInputChange('vehiculo', val)}
            loading={loadingStates.vehiculos}
            getText={(item) => item.patente === '-- Sin asignar --' ? item.patente : `${item.patente} - ${item.marca} ${item.modelo}`}
            getSecondaryText={(item) => item.empresa?.nombre_empresa && `Empresa: ${item.empresa.nombre_empresa}`}
            emptyText="No hay vehículos disponibles"
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default ChoferForm;