import { 
  Grid, InputLabel, TextField, Box, Typography, Avatar, MenuItem 
} from '@mui/material';
import { grey, indigo } from "@mui/material/colors";
import BusinessIcon from '@mui/icons-material/Business';
import ErrorText from '../ErrorText';

const TIPOS_DEPOSITO = ['Propio', 'Tercerizado'];

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
  formData = {},  // Aseguramos que formData tenga un valor por defecto
  handleChange, 
  handleBlur, 
  errors, 
  isEditing = false 
}) => {
  // Creamos un objeto seguro con valores por defecto para evitar undefined
  const safeFormData = {
    tipo: formData.tipo || '',
    horarios: formData.horarios || '',
    nombreContacto: formData.nombreContacto || '',
    apellidoContacto: formData.apellidoContacto || '',
    telefonoContacto: formData.telefonoContacto || '',
    calle: formData.calle || '',
    numero: formData.numero || '',
    provincia: formData.provincia || '',
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
          
          <FormInput 
            label="Franja Horaria" 
            name="horarios" 
            required 
            value={safeFormData.horarios} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.horarios} 
            placeholder="Ej: 08:00 - 18:00"
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
            label="Calle" 
            name="calle" 
            required 
            value={safeFormData.calle} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors.calle} 
          />
          <FormInput 
            label="Número" 
            name="numero" 
            value={safeFormData.numero} 
            onChange={handleChange} 
            type="number"
          />
          <FormInput 
            label="Provincia/Estado" 
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