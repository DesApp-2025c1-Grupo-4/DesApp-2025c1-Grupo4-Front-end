import {
  Grid, InputLabel, TextField, Autocomplete, Box, Typography, List, ListItem,
  ListItemText, CircularProgress, IconButton, Divider, Modal, Button, Paper, Avatar
} from '@mui/material';
import { grey, blue, indigo } from "@mui/material/colors";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import { Search, Close, Person, Business, DirectionsCar } from '@mui/icons-material';
import axios from 'axios';
import ErrorText from '../ErrorText';

// Subcomponentes reutilizables
const FieldContainer = ({ label, children, error }) => (
  <Box sx={{ mb: 2 }}>
    <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
      {label}
    </InputLabel>
    {children}
    {error && <ErrorText>{error}</ErrorText>}
  </Box>
);

const IconButtonStyled = ({ onClick, icon: Icon }) => (
  <IconButton
    onClick={onClick}
    sx={{
      borderRadius: 2,
      border: `1px solid ${grey[300]}`,
      backgroundColor: 'background.paper',
      '&:hover': { backgroundColor: grey[100] }
    }}
  >
    <Icon />
  </IconButton>
);

const styles = {
  field: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': { borderColor: grey[300] }
    }
  },
  modalPaper: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 500, boxShadow: 24, p: 3, borderRadius: 2, maxHeight: '80vh', display: 'flex', flexDirection: 'column'
  }
};

// Hook reutilizable para búsqueda con debounce
const useDebouncedFetch = (url, paramName, value, setData, setLoading) => {
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (value.length > 2 || !value.length) {
        setLoading(true);
        try {
          const res = await axios.get(url, { params: { [paramName]: value } });
          setData(res.data);
        } catch (error) {
          console.error(`Error fetching ${url}:`, error);
        } finally {
          setLoading(false);
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);
};

// Modal genérico de selección
const SelectionModal = ({
  open, onClose, title, items, onSelect, searchValue, onSearchChange,
  loading, getText, getSecondaryText, emptyText, icon: Icon
}) => (
  <Modal open={open} onClose={onClose}>
    <Paper sx={styles.modalPaper}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {Icon && <Icon color="primary" />}
          <Typography variant="h6" color="primary">{title}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </Box>

      <TextField
        fullWidth value={searchValue} onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar..." size="small"
        InputProps={{ startAdornment: <Search sx={{ mr: 1, color: grey[500] }} /> }}
        sx={{ mb: 2, ...styles.field }}
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
                key={item._id} button
                onClick={() => { onSelect(item); onClose(); }}
                sx={{ '&:hover': { backgroundColor: blue[50] } }}
              >
                <ListItemText
                  primary={<Typography fontWeight="medium">{getText(item)}</Typography>}
                  secondary={getSecondaryText?.(item) && (
                    <Typography variant="body2" color="text.secondary">
                      {getSecondaryText(item)}
                    </Typography>
                  )}
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

// Componente principal
const ChoferForm = ({ formData, handleChange, handleBlur, errors, empresas: empresasIniciales = [], vehiculos = [], isEditing = false }) => {
  const [empresas, setEmpresas] = useState(empresasIniciales);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(vehiculos);
  const [inputValues, setInputValues] = useState({ empresa: '', vehiculo: '' });
  const [loadingStates, setLoadingStates] = useState({ empresas: false, vehiculos: false });
  const [modalStates, setModalStates] = useState({ empresas: false, vehiculos: false });

  useDebouncedFetch('/api/empresas', 'nombre', inputValues.empresa, setEmpresas, (loading) => setLoadingStates(prev => ({ ...prev, empresas: loading })));
  useDebouncedFetch('/api/vehiculos', 'patente', inputValues.vehiculo, setVehiculosDisponibles, (loading) => setLoadingStates(prev => ({ ...prev, vehiculos: loading })));

  const onEmpresaSelect = (empresa) => {
    const empresaId = empresa._id.replace(/^"|"$/g, '');
    handleChange({ target: { name: "empresa", value: empresaId } });
  };

  const onVehiculoSelect = (vehiculo) => {
    const vehiculoId = vehiculo._id.replace(/^"|"$/g, '');
    handleChange({ target: { name: "vehiculoAsignado", value: vehiculoId } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Información Personal */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Información personal</Typography>
            {['nombre', 'apellido', 'cuil'].map((field) => (
              <FieldContainer key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} error={errors[field]}>
                <TextField
                  fullWidth size="small" name={field} value={formData[field] || ''}
                  onChange={handleChange} onBlur={handleBlur} error={!!errors[field]}
                  placeholder={field === 'cuil' ? 'XX-XXXXXXXX-X' : ''}
                  readOnly={field === 'cuil' && isEditing} sx={styles.field}
                />
              </FieldContainer>
            ))}
            <FieldContainer label="Fecha de Nacimiento" error={errors.fechaNacimiento}>
              <DatePicker
                value={formData.fechaNacimiento || null}
                onChange={(date) => handleChange({ target: { name: 'fechaNacimiento', value: date } })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors.fechaNacimiento,
                    sx: styles.field
                  }
                }}
              />
            </FieldContainer>
          </Grid>

          {/* Información Laboral */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Información laboral</Typography>

            <FieldContainer label="Empresa" error={errors.empresa}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth size="small" value={formData.empresa?.nombre_empresa || ''}
                  sx={styles.field}
                  InputProps={{
                    readOnly: true,
                    startAdornment: formData.empresa && <Business sx={{ mr: 1, color: grey[600] }} />
                  }}
                />
                <IconButtonStyled onClick={() => setModalStates(prev => ({ ...prev, empresas: !prev.empresas }))} icon={Search} />
              </Box>
            </FieldContainer>

            <FieldContainer label="Vehículo Asignado" error={errors.vehiculoAsignado}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth size="small"
                  value={
                    formData.vehiculoAsignado
                      ? `${formData.vehiculoAsignado.patente} - ${[formData.vehiculoAsignado.marca, formData.vehiculoAsignado.modelo].filter(Boolean).join(' ')}`
                      : '-- Sin asignar --'
                  }
                  sx={styles.field}
                  InputProps={{
                    readOnly: true,
                    startAdornment: formData.vehiculoAsignado && <DirectionsCar sx={{ mr: 1, color: grey[600] }} />
                  }}
                />
                <IconButtonStyled onClick={() => setModalStates(prev => ({ ...prev, vehiculos: !prev.vehiculos }))} icon={Search} />
              </Box>
            </FieldContainer>

            <FieldContainer label="Número de Licencia" error={errors.licenciaNumero}>
              <TextField
                fullWidth
                size="small"
                name="licenciaNumero"
                value={formData.licenciaNumero || ''}
                onChange={handleChange}
                sx={styles.field}
              />
            </FieldContainer>

            <FieldContainer label="Tipo de Licencia" error={errors.licenciaTipo}>
              <Autocomplete
                multiple
                options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'C3', 'D1', 'D2', 'E']}
                value={formData.licenciaTipo || []}
                onChange={(_, value) => handleChange({ target: { name: 'licenciaTipo', value } })}
                renderInput={(params) => (
                  <TextField {...params} size="small" sx={styles.field} />
                )}
              />
            </FieldContainer>

            <FieldContainer label="Fecha Expiración Licencia" error={errors.licenciaExpiracion}>
              <DatePicker
                value={formData.licenciaExpiracion || null}
                onChange={(date) => handleChange({ target: { name: 'licenciaExpiracion', value: date } })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: styles.field
                  }
                }}
              />
            </FieldContainer>
          </Grid>
        </Grid>

        {/* Modales */}
        <SelectionModal
          open={modalStates.empresas} onClose={() => setModalStates(prev => ({ ...prev, empresas: !prev.empresas }))}
          title="Seleccionar Empresa" items={empresas} loading={loadingStates.empresas}
          onSelect={onEmpresaSelect}
          searchValue={inputValues.empresa} onSearchChange={(val) => setInputValues(prev => ({ ...prev, empresa: val }))}
          getText={(item) => item.nombre_empresa}
          getSecondaryText={(item) => item.cuit && `CUIT: ${item.cuit}`}
          emptyText="No hay empresas disponibles"
          icon={Business}
        />

        <SelectionModal
          open={modalStates.vehiculos} onClose={() => setModalStates(prev => ({ ...prev, vehiculos: !prev.vehiculos }))}
          title="Seleccionar Vehículo"
          items={[{ _id: 'null', patente: '-- Sin asignar --' }, ...vehiculosDisponibles]}
          loading={loadingStates.vehiculos}
          onSelect={onVehiculoSelect}
          searchValue={inputValues.vehiculo} onSearchChange={(val) => setInputValues(prev => ({ ...prev, vehiculo: val }))}
          getText={(item) => item.patente}
          getSecondaryText={(item) => item.empresa?.nombre_empresa && `Empresa: ${item.empresa.nombre_empresa}`}
          emptyText={formData.empresa ? "No hay vehículos para esta empresa" : "No hay vehículos disponibles"}
          icon={DirectionsCar}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default ChoferForm;
