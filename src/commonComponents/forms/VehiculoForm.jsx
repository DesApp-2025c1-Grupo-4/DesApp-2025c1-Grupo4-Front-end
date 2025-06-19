import {
  Grid,
  InputLabel,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  MenuItem,
  IconButton,
  Avatar,
  Paper,
  Button
} from '@mui/material';
import { grey, indigo, blue } from '@mui/material/colors';
import ErrorText from '../ErrorText';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BusinessIcon from '@mui/icons-material/Business';
import Modal from '@mui/material/Modal';

const TIPOS_VEHICULO = ['Camión', 'Camioneta', 'Furgón', 'Auto', 'Moto'];

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
      if (!value || value.length === 0 || value.length > 2) {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);
};

const InputField = ({ label, name, value, onChange, onBlur, error, placeholder, type = 'text', helperText, readOnly = false, inputProps, endAdornment }) => (
  <Box sx={{ mb: 2 }}>
    <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>{label}</InputLabel>
    <TextField
      fullWidth
      size="small"
      name={name}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      placeholder={placeholder}
      type={type}
      helperText={helperText}
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: grey[300] } } }}
      InputProps={{ readOnly, endAdornment, inputProps }}
    />
    {error && <ErrorText>{error}</ErrorText>}
  </Box>
);

const SelectionModal = ({ open, onClose, title, items, onSelect, searchValue, onSearchChange, loading, getText, getSecondaryText, emptyText, icon: Icon }) => (
  <Modal open={open} onClose={onClose}>
    <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, boxShadow: 24, p: 3, borderRadius: 2, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {Icon && <Icon color="primary" />}
          <Typography variant="h6" color="primary">{title}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </Box>

      <TextField
        fullWidth
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar..."
        variant="outlined"
        size="small"
        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: grey[500] }} /> }}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      <Paper elevation={0} sx={{ flex: 1, overflow: 'auto', border: `1px solid ${grey[200]}`, borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress size={24} /></Box>
        ) : items.length > 0 ? (
          <List dense>
            {items.map((item) => (
              <ListItem key={item._id} button onClick={() => { onSelect(item); onClose(); }} sx={{ '&:hover': { backgroundColor: blue[50] } }}>
                <ListItemText
                  primary={<Typography fontWeight="medium">{getText(item)}</Typography>}
                  secondary={<Typography variant="body2" color="text.secondary">{getSecondaryText?.(item)}</Typography>}
                  sx={{ my: 0 }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">{emptyText}</Typography>
          </Box>
        )}
      </Paper>

      <Button variant="outlined" onClick={onClose} sx={{ mt: 2, alignSelf: 'flex-end', borderRadius: 2, textTransform: 'none' }}>
        Cancelar
      </Button>
    </Paper>
  </Modal>
);

const VehiculoForm = ({ formData, handleChange, handleBlur, errors, isEditing = false }) => {
  const [empresas, setEmpresas] = useState([]);
  const [inputValues, setInputValues] = useState({ empresa: formData.empresa?.nombre_empresa || '' });
  const [loadingStates, setLoadingStates] = useState({ empresas: false });
  const [modalStates, setModalStates] = useState({ empresas: false });

  useEffect(() => {
    if (isEditing && formData.empresa) {
      setInputValues(prev => ({ ...prev, empresa: formData.empresa.nombre_empresa }));
    }
  }, [isEditing, formData.empresa]);

  useDebouncedFetch('/api/empresas', 'nombre', inputValues.empresa, setEmpresas, (loading) => setLoadingStates(prev => ({ ...prev, empresas: loading })));

  const handleInputChange = (key, value) => setInputValues(prev => ({ ...prev, [key]: value }));
  const toggleModal = (key) => setModalStates(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <Box sx={{ p: 2 }}>
      {isEditing && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, pt: 1 }}>
          <Avatar sx={{ bgcolor: indigo[100] }}><DirectionsCarIcon color="primary" /></Avatar>
          <Typography variant="h6" color="primary">Modificar Vehículo: {formData.patente}</Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Información del vehículo</Typography>
          <InputField label="Patente" name="patente" value={formData.patente} onChange={handleChange} onBlur={handleBlur} error={errors.patente} placeholder="Ej: AA123BB" readOnly={isEditing} />
          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>Tipo de Vehículo</InputLabel>
            <TextField select fullWidth size="small" name="tipoVehiculo" value={formData.tipoVehiculo || ''} onChange={handleChange} onBlur={handleBlur} error={!!errors.tipoVehiculo} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: grey[300] } } }}>
              <MenuItem value="" disabled>Seleccione un tipo</MenuItem>
              {TIPOS_VEHICULO.map((tipo) => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
            </TextField>
            {errors.tipoVehiculo && <ErrorText>{errors.tipoVehiculo}</ErrorText>}
          </Box>
          <InputField label="Marca" name="marca" value={formData.marca} onChange={handleChange} onBlur={handleBlur} error={errors.marca} placeholder="Ej: Ford, Toyota" />
          <InputField label="Modelo" name="modelo" value={formData.modelo} onChange={handleChange} onBlur={handleBlur} error={errors.modelo} placeholder="Ej: Focus, Hilux" />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Especificaciones</Typography>
          <InputField label="Capacidad (Volumen)" name="volumen" value={formData.volumen} onChange={handleChange} onBlur={handleBlur} error={errors.volumen} type="number" helperText={isEditing ? `Actual: ${formData.volumenOriginal || 'N/D'}` : undefined} endAdornment={<span>m³</span>} />
          <InputField label="Capacidad (Peso)" name="peso" value={formData.peso} onChange={handleChange} onBlur={handleBlur} error={errors.peso} type="number" helperText={isEditing ? `Actual: ${formData.pesoOriginal || 'N/D'}` : undefined} endAdornment={<span>kg</span>} />
          <InputField label="Año" name="año" value={formData.año} onChange={handleChange} onBlur={handleBlur} error={errors.año} type="number" placeholder={`Ej: ${new Date().getFullYear()}`} inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }} />

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>Empresa</InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.empresa ? formData.empresa.nombre_empresa : ''}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: grey[300] } } }}
                InputProps={{ readOnly: true, startAdornment: formData.empresa && (<BusinessIcon sx={{ mr: 1, color: grey[600] }} />) }}
              />
              <IconButton onClick={() => toggleModal('empresas')} sx={{ borderRadius: 2, border: `1px solid ${grey[300]}`, backgroundColor: 'background.paper', '&:hover': { backgroundColor: grey[100] } }}>
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
              handleChange({ target: { name: 'empresa', value: empresa } });
              setInputValues(prev => ({ ...prev, empresa: empresa.nombre_empresa }));
            }}
            searchValue={inputValues.empresa}
            onSearchChange={(val) => handleInputChange('empresa', val)}
            loading={loadingStates.empresas}
            getText={(item) => item.nombre_empresa}
            getSecondaryText={(item) => item.cuit && `CUIT: ${item.cuit}`}
            emptyText="No hay empresas disponibles"
            icon={BusinessIcon}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehiculoForm;
