import {
  Grid, InputLabel, TextField, Box, Typography, FormGroup,
  FormControlLabel, Checkbox, MenuItem, Button
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import ErrorText from '../ErrorText';

const TIPOS_DEPOSITO = ['Propio', 'Tercerizado'];
const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const FormInput = ({ label, name, required = false, value, onChange, onBlur, error, type = 'text', select = false, children, placeholder }) => (
  <Box sx={{ mb: 2 }}>
    <InputLabel required={required} sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>{label}</InputLabel>
    <TextField
      fullWidth size="small" name={name} value={value || ''}
      onChange={onChange} onBlur={onBlur} error={!!error} type={type} select={select} placeholder={placeholder}
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: grey[300] } } }}
    >
      {select ? children : null}
    </TextField>
    {error && <ErrorText>{error}</ErrorText>}
  </Box>
);

const DepositoForm = ({ formData = {}, handleChange, handleBlur, errors, onOpenMap, selectedLocation }) => {
  const horarios = formData.horarios || { dias: [], desde: '', hasta: '' };

  const handleDiaChange = (dia) => {
    const nuevosDias = horarios.dias.includes(dia)
      ? horarios.dias.filter(d => d !== dia)
      : [...horarios.dias, dia];
    handleChange({ target: { name: 'horarios', value: { ...horarios, dias: nuevosDias } } });
  };

  const handleHorarioTimeChange = (field, value) => {
    handleChange({ target: { name: 'horarios', value: { ...horarios, [field]: value } } });
  };

  const contactoFields = [
    { label: 'Nombre', name: 'nombreContacto' },
    { label: 'Apellido', name: 'apellidoContacto' },
    { label: 'Teléfono', name: 'telefonoContacto', type: 'tel' }
  ];

  const ubicacionFields = [
    { label: 'Dirección', name: 'direccion' },
    { label: 'Ciudad', name: 'ciudad' },
    { label: 'Provincia', name: 'provincia' },
    { label: 'País', name: 'pais' }
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" className="formSectionTitle">Información del Depósito</Typography>

          <FormInput
            label="Tipo de Depósito" name="tipo" required select
            value={formData.tipo || ''} onChange={handleChange} onBlur={handleBlur} error={errors.tipo}
          >
            <MenuItem value="" disabled>Seleccione un tipo</MenuItem>
            {TIPOS_DEPOSITO.map(tipo => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
          </FormInput>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: grey[700], mb: 1 }}>Días de Horario *</Typography>
          <FormGroup row>
            {DIAS_SEMANA.map(dia => (
              <FormControlLabel
                key={dia}
                control={
                  <Checkbox
                    checked={horarios.dias.includes(dia)}
                    onChange={() => handleDiaChange(dia)}
                    sx={{ color: grey[700], '&.Mui-checked': { color: 'primary.main' } }}
                  />
                }
                label={dia.charAt(0).toUpperCase() + dia.slice(1)}
                sx={{ mr: 2 }}
              />
            ))}
          </FormGroup>
          {errors.horarios?.dias && <ErrorText>{errors.horarios.dias}</ErrorText>}

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {['desde', 'hasta'].map(field => (
              <TextField
                key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} type="time" value={horarios[field] || ''}
                onChange={(e) => handleHorarioTimeChange(field, e.target.value)} InputLabelProps={{ shrink: true }}
                error={!!errors.horarios?.[field]} helperText={errors.horarios?.[field]}
                sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: grey[300] } } }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" className="formSectionTitle">Información de Contacto</Typography>
          {contactoFields.map(({ label, name, type }) => (
            <FormInput
              key={name} label={label} name={name} required type={type}
              value={formData[name] || ''} onChange={handleChange} onBlur={handleBlur} error={errors[name]}
            />
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" className="formSectionTitle">Ubicación</Typography>
          {ubicacionFields.map(({ label, name }) => (
            <FormInput
              key={name} label={label} name={name} required
              value={formData[name] || ''} onChange={handleChange} onBlur={handleBlur} error={errors[name]}
            />
          ))}

          <Box sx={{ mt: 2 }}>
            <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>Coordenadas (lat, long)</InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth size="small" name="coordenadas"
                value={formData.coordenadasRaw
                  ? `${formData.coordenadasRaw.coordinates[1]}, ${formData.coordenadasRaw.coordinates[0]}`
                  : (formData.coordenadas || '')}
                onChange={(e) => {
                  handleChange({ target: { name: 'coordenadas', value: e.target.value } });
                  if (errors.coordenadas) handleBlur({ target: { name: 'coordenadas' } });
                }}
                onBlur={(e) => {
                  if (e.target.value && !/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(e.target.value)) {
                    handleChange({ target: { name: 'errors', value: { ...errors, coordenadas: 'Formato inválido. Ejemplo: -34.603722, -58.381592' } } });
                  }
                  handleBlur(e);
                }}
                error={!!errors.coordenadas} placeholder="Ejemplo: -34.603722, -58.381592"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: grey[300] } } }}
              />
              <Button variant="outlined" onClick={onOpenMap} startIcon={<LocationOn />} sx={{ minWidth: 'auto', height: 40, borderRadius: 2, textTransform: 'none' }}>
                Mapa
              </Button>
            </Box>
            {errors.coordenadas && <ErrorText>{errors.coordenadas}</ErrorText>}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepositoForm;
