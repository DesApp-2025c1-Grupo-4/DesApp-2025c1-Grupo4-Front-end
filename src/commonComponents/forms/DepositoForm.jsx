import { 
  Grid, InputLabel, TextField, Box, Typography, FormGroup, FormControlLabel, Checkbox, MenuItem 
} from '@mui/material';
import ErrorText from '../ErrorText';

// Constantes para opciones del formulario
const TIPOS_DEPOSITO = ['Propio', 'Tercerizado'];
const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

// Componente reutilizable para inputs del formulario
const FormInput = ({ 
  label, 
  name, 
  required = false, 
  value, 
  onChange, 
  onBlur, 
  error, 
  type = 'text',
  select = false,
  children,
  placeholder
}) => (
  <Box>
    <InputLabel required={required}>{label}</InputLabel>
    <TextField
      fullWidth
      size="small"
      name={name}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      type={type}
      select={select}
      placeholder={placeholder}
    >
      {select ? children : null}
    </TextField>
    {error && <ErrorText>{error}</ErrorText>}
  </Box>
);

// Componente para el formulario de Depósito
const DepositoForm = ({ formData = {}, handleChange, handleBlur, errors }) => {
  // Datos de horarios con valores por defecto
  const horarios = formData.horarios || { dias: [], desde: '', hasta: '' };

  // Manejador para días de horario
  const handleDiaChange = (dia) => {
    const nuevosDias = horarios.dias.includes(dia)
      ? horarios.dias.filter(d => d !== dia)
      : [...horarios.dias, dia];
    handleChange({
      target: {
        name: 'horarios',
        value: { ...horarios, dias: nuevosDias }
      }
    });
  };

  // Manejador para horas de horario
  const handleHorarioTimeChange = (field, value) => {
    handleChange({ 
      target: { 
        name: 'horarios', 
        value: { ...horarios, [field]: value } 
      } 
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Sección: Información del Depósito */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" className="formSectionTitle">
            Información del Depósito
          </Typography>
          
          <FormInput 
            label="Tipo de Depósito" 
            name="tipo" 
            required 
            value={formData.tipo || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.tipo}
            select
          >
            <MenuItem value="" disabled>Seleccione un tipo</MenuItem>
            {TIPOS_DEPOSITO.map(tipo => (
              <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
            ))}
          </FormInput>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Días de Horario *
          </Typography>
          <FormGroup row>
            {DIAS_SEMANA.map(dia => (
              <FormControlLabel
                key={dia}
                control={
                  <Checkbox
                    checked={horarios.dias.includes(dia)}
                    onChange={() => handleDiaChange(dia)}
                  />
                }
                label={dia.charAt(0).toUpperCase() + dia.slice(1)}
              />
            ))}
          </FormGroup>
          {errors.horarios?.dias && <ErrorText>{errors.horarios.dias}</ErrorText>}

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField
              label="Desde"
              type="time"
              value={horarios.desde || ''}
              onChange={(e) => handleHorarioTimeChange('desde', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.horarios?.desde}
              helperText={errors.horarios?.desde}
              sx={{ width: 120 }}
            />
            <TextField
              label="Hasta"
              type="time"
              value={horarios.hasta || ''}
              onChange={(e) => handleHorarioTimeChange('hasta', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.horarios?.hasta}
              helperText={errors.horarios?.hasta}
              sx={{ width: 120 }}
            />
          </Box>
        </Grid>

        {/* Sección: Información de Contacto */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" className="formSectionTitle">
            Información de Contacto
          </Typography>
          <FormInput 
            label="Nombre" 
            name="nombreContacto" 
            required 
            value={formData.nombreContacto || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.nombreContacto} 
          />
          <FormInput 
            label="Apellido" 
            name="apellidoContacto" 
            required 
            value={formData.apellidoContacto || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.apellidoContacto} 
          />
          <FormInput 
            label="Teléfono" 
            name="telefonoContacto" 
            required 
            value={formData.telefonoContacto || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.telefonoContacto} 
            type="tel"
          />
        </Grid>

        {/* Sección: Ubicación */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" className="formSectionTitle">
            Ubicación
          </Typography>
          <FormInput 
            label="Direccion" 
            name="direccion" 
            required 
            value={formData.direccion || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.direccion} 
          />
          <FormInput 
            label="Ciudad" 
            name="ciudad" 
            required 
            value={formData.ciudad || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.ciudad} 
          />
          <FormInput 
            label="Provincia" 
            name="provincia" 
            required 
            value={formData.provincia || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.provincia} 
          />
          <FormInput 
            label="País" 
            name="pais" 
            required 
            value={formData.pais || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.pais} 
          />
           <FormInput 
  label="Coordenadas (lat, long)" 
  name="coordenadas" 
  required
  value={
    formData.coordenadasRaw 
      ? `${formData.coordenadasRaw.coordinates[1]}, ${formData.coordenadasRaw.coordinates[0]}`
      : (formData.coordenadas || '')
  }
  onChange={(e) => {
    handleChange({
      target: {
        name: 'coordenadas',
        value: e.target.value
      }
    });
    // Limpiar error si existe
    if (errors.coordenadas) {
      handleBlur({ target: { name: 'coordenadas' } });
    }
  }}
  onBlur={(e) => {
    // Validar formato
    if (e.target.value && !COORDENADAS_REGEX.test(e.target.value)) {
      handleChange({
        target: {
          name: 'errors',
          value: {
            ...errors,
            coordenadas: 'Formato inválido. Ejemplo: -34.603722, -58.381592'
          }
        }
      });
    }
    handleBlur(e);
  }}
  error={errors.coordenadas}
  placeholder="Ejemplo: -34.603722, -58.381592"
/>

        </Grid>
      </Grid>
    </Box>
  );
};

export default DepositoForm;