import { 
  Grid, InputLabel, TextField, Box, Typography, FormGroup, FormControlLabel, Checkbox, MenuItem 
} from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';

const TIPOS_DEPOSITO = ['Propio', 'Tercerizado'];
const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

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
  <Box sx={{ mb: 2 }}>
    <InputLabel required={required} sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
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
      type={type}
      select={select}
      placeholder={placeholder}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '& fieldset': { borderColor: grey[300] },
        }
      }}
    >
      {select ? children : null}
    </TextField>
    {error && <ErrorText>{error}</ErrorText>}
  </Box>
);

const DepositoForm = ({ 
  formData = {}, 
  handleChange, 
  handleBlur, 
  errors, 
  isEditing = false 
}) => {
  // Inicializo horarios seguro para evitar errores si no viene definido
  const horarios = formData.horarios || { dias: [], desde: '', hasta: '' };

  // Handler para manejar cambios en los días seleccionados
  const handleDiaChange = (dia) => {
    const diasActuales = horarios.dias || [];
    let nuevosDias;
    if (diasActuales.includes(dia)) {
      nuevosDias = diasActuales.filter(d => d !== dia);
    } else {
      nuevosDias = [...diasActuales, dia];
    }
    handleChange({
      target: {
        name: 'horarios',
        value: { ...horarios, dias: nuevosDias }
      }
    });
  };

  const validateHorarios = (horarios) => {
    if (!horarios.desde || !horarios.hasta) return true;
    const [fromHours, fromMinutes] = horarios.desde.split(':').map(Number);
    const [toHours, toMinutes] = horarios.hasta.split(':').map(Number);
    return toHours > fromHours || (toHours === fromHours && toMinutes > fromMinutes);
  };


  const handleHorarioTimeChange = (field, value) => {
  const newHorarios = { ...horarios, [field]: value };
  handleChange({ target: { name: 'horarios', value: newHorarios } });
};

  const safeFormData = {
    tipo: formData.tipo || '',
    nombreContacto: formData.nombreContacto || '',
    apellidoContacto: formData.apellidoContacto || '',
    telefonoContacto: formData.telefonoContacto || '',
    direccion: formData.direccion || '',
    provincia: formData.provincia || '',
    ciudad: formData.ciudad || '',
    pais: formData.pais || '',
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Columna 1: Información del Depósito */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            Información del Depósito
          </Typography>
          
          <FormInput 
            label="Tipo de Depósito" 
            name="tipo" 
            required 
            value={safeFormData.tipo} 
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

          <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
            Días de Horario *
          </Typography>
          <FormGroup row sx={{ mb: errors.horarios?.dias ? 0 : 2 }}>
            {DIAS_SEMANA.map(dia => (
              <FormControlLabel
                key={dia}
                control={
                  <Checkbox
                    checked={horarios.dias.includes(dia)}
                    onChange={() => handleDiaChange(dia)}
                    name={`dia-${dia}`}
                  />
                }
                label={dia.charAt(0).toUpperCase() + dia.slice(1)}
              />
            ))}
          </FormGroup>
          {errors.horarios?.dias && <ErrorText>{errors.horarios.dias}</ErrorText>}

          <TextField
            label="Desde"
            type="time"
            name="horarios.desde"
            value={horarios.desde || ''}
            onChange={e => handleHorarioTimeChange('desde', e.target.value)}
            onBlur={handleBlur}  
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            error={!!errors.horarios?.desde}
            helperText={errors.horarios?.desde}
            sx={{ mt: 2, mr: 1, width: 120 }}
          />

          <TextField
            label="Hasta"
            type="time"
            name="horarios.hasta"
            value={horarios.hasta || ''}
            onChange={e => handleHorarioTimeChange('hasta', e.target.value)}
            onBlur={handleBlur} 
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            error={!!errors.horarios?.hasta}
            helperText={errors.horarios?.hasta}
            sx={{ mt: 2, width: 120 }}
          />
        </Grid>

        {/* Columna 2: Información de Contacto */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            Información de Contacto
          </Typography>
          <FormInput 
            label="Nombre" 
            name="nombreContacto" 
            required 
            value={safeFormData.nombreContacto} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.nombreContacto} 
          />
          <FormInput 
            label="Apellido" 
            name="apellidoContacto" 
            required 
            value={safeFormData.apellidoContacto} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.apellidoContacto} 
          />
          <FormInput 
            label="Teléfono" 
            name="telefonoContacto" 
            required 
            value={safeFormData.telefonoContacto} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.telefonoContacto} 
            type="tel"
          />
        </Grid>

        {/* Columna 3: Ubicación */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            Ubicación
          </Typography>
          <FormInput 
            label="Direccion" 
            name="direccion" 
            required 
            value={safeFormData.direccion} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.direccion} 
          />
          <FormInput 
            label="Ciudad" 
            name="ciudad" 
            required 
            value={safeFormData.ciudad} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.ciudad} 
          />
          <FormInput 
            label="Provincia" 
            name="provincia" 
            required 
            value={safeFormData.provincia} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.provincia} 
          />
          <FormInput 
            label="País" 
            name="pais" 
            required 
            value={safeFormData.pais} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.pais} 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepositoForm;
