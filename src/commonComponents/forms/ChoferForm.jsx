import { Grid, InputLabel, TextField } from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';

const ChoferForm = ({ formData, handleChange, handleBlur, errors }) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Nombre</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="nombre" 
        value={formData.nombre} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.nombre}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.nombre && <ErrorText>{errors.nombre}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Apellido</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="apellido" 
        value={formData.apellido} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.apellido}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.apellido && <ErrorText>{errors.apellido}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>DNI</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="dni" 
        value={formData.dni} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.dni}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.dni && <ErrorText>{errors.dni}</ErrorText>}
    </Grid>

    <Grid item xs={6}>
      <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Fecha de Nacimiento</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="fechaNacimiento" 
        type="date" 
        InputLabelProps={{ shrink: true }} 
        value={formData.fechaNacimiento} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.fechaNacimiento}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.fechaNacimiento && <ErrorText>{errors.fechaNacimiento}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Empresa</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="empresa" 
        value={formData.empresa} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.empresa}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.empresa && <ErrorText>{errors.empresa}</ErrorText>}

      <InputLabel sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Vehículo Asignado</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="vehiculoAsignado" 
        value={formData.vehiculoAsignado} 
        onChange={handleChange}
        sx={{backgroundColor: grey[50]}} 
      />
    </Grid>
  </Grid>
);

export default ChoferForm;