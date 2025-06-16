import { Grid, InputLabel, TextField } from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';

const VehiculoForm = ({ formData, handleChange, handleBlur, errors }) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Patente</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="patente" 
        value={formData.patente} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.patente}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.patente && <ErrorText>{errors.patente}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Tipo de Vehículo</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="tipoVehiculo" 
        value={formData.tipoVehiculo} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.tipoVehiculo}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.tipoVehiculo && <ErrorText>{errors.tipoVehiculo}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Marca</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="marca" 
        value={formData.marca} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.marca}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.marca && <ErrorText>{errors.marca}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Modelo</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="modelo" 
        value={formData.modelo} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.modelo}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.modelo && <ErrorText>{errors.modelo}</ErrorText>}
    </Grid>

    <Grid item xs={6}>
      <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Capacidad (Volumen)</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="volumen" 
        value={formData.volumen} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.volumen}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.volumen && <ErrorText>{errors.volumen}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Capacidad (Peso)</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="peso" 
        value={formData.peso} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.peso}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.peso && <ErrorText>{errors.peso}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Año</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="año" 
        value={formData.año} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.año}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.año && <ErrorText>{errors.año}</ErrorText>}

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
    </Grid>
  </Grid>
);

export default VehiculoForm;