import { Grid, InputLabel, TextField, Box, Typography, Avatar } from '@mui/material';
import { grey, indigo } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import BusinessIcon from '@mui/icons-material/Business';

const FormInput = ({ label, name, required, value, onChange, onBlur, error }) => (
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
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '& fieldset': { borderColor: grey[300] },
        }
      }}
    />
    {error && <ErrorText>{error}</ErrorText>}
  </Box>
);

const DepositoForm = ({ formData, handleChange, handleBlur, errors, isEditing = false }) => (
  <Box>
    {isEditing && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: indigo[100] }}>
          <BusinessIcon color="primary" />
        </Avatar>
        <Typography variant="h6" color="primary">
          Modificar Depósito: {formData.tipo}
        </Typography>
      </Box>
    )}

    <Grid container spacing={3}>
      {/* Columna 1: Información del Depósito */}
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Información del Depósito
        </Typography>
        <FormInput label="Tipo de Depósito" name="tipo" required value={formData.tipo} onChange={handleChange} onBlur={handleBlur} error={errors.tipo} />
        <FormInput label="Franja Horaria" name="horarios" required value={formData.horarios} onChange={handleChange} onBlur={handleBlur} error={errors.horarios} />
        
        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Información Legal
        </Typography>
        <FormInput label="Razón Social" name="razonSocial" required value={formData.razonSocial} onChange={handleChange} onBlur={handleBlur} error={errors.razonSocial} />
        <FormInput label="CUIT/RUT" name="cuit" required value={formData.cuit} onChange={handleChange} onBlur={handleBlur} error={errors.cuit} />
      </Grid>

      {/* Columna 2: Información de Contacto */}
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Información de Contacto
        </Typography>
        <FormInput label="Nombre" name="nombreContacto" required value={formData.nombreContacto} onChange={handleChange} onBlur={handleBlur} error={errors.nombreContacto} />
        <FormInput label="Apellido" name="apellidoContacto" required value={formData.apellidoContacto} onChange={handleChange} onBlur={handleBlur} error={errors.apellidoContacto} />
        <FormInput label="Teléfono" name="telefonoContacto" required value={formData.telefonoContacto} onChange={handleChange} onBlur={handleBlur} error={errors.telefonoContacto} />
      </Grid>

      {/* Columna 3: Ubicación */}
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Ubicación
        </Typography>
        <FormInput label="Calle" name="calle" required value={formData.calle} onChange={handleChange} onBlur={handleBlur} error={errors.calle} />
        <FormInput label="Número" name="numero" value={formData.numero} onChange={handleChange} />
        <FormInput label="Provincia/Estado" name="provincia" required value={formData.provincia} onChange={handleChange} onBlur={handleBlur} error={errors.provincia} />
        <FormInput label="País" name="pais" required value={formData.pais} onChange={handleChange} onBlur={handleBlur} error={errors.pais} />
        <FormInput label="Coordenadas (opcional)" name="coordenadas" value={formData.coordenadas} onChange={handleChange} />
      </Grid>
    </Grid>
  </Box>
);

export default DepositoForm;
