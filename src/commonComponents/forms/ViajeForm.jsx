import { Grid, InputLabel, TextField } from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';

const ViajeForm = ({ formData, handleChange, handleBlur, errors }) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Depósito de Origen</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="depositoOrigen" 
        value={formData.depositoOrigen} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.depositoOrigen}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.depositoOrigen && <ErrorText>{errors.depositoOrigen}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Depósito de Destino</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="depositoDestino" 
        value={formData.depositoDestino} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.depositoDestino}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.depositoDestino && <ErrorText>{errors.depositoDestino}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Fecha y Hora de Inicio</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="fechaHoraInicio" 
        type="datetime-local" 
        value={formData.fechaHoraInicio} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.fechaHoraInicio}
        InputLabelProps={{ shrink: true }}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.fechaHoraInicio && <ErrorText>{errors.fechaHoraInicio}</ErrorText>}
    </Grid>

    <Grid item xs={6}>
      <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>Fecha y Hora de Fin</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="fechaHoraFin" 
        type="datetime-local" 
        value={formData.fechaHoraFin} 
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{backgroundColor: grey[50]}} 
      />

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Empresa</InputLabel>
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

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Chofer</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="chofer" 
        value={formData.chofer} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.chofer}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.chofer && <ErrorText>{errors.chofer}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Vehículo</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="vehiculo" 
        value={formData.vehiculo} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.vehiculo}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.vehiculo && <ErrorText>{errors.vehiculo}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Tipo de Viaje</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="tipoViaje" 
        value={formData.tipoViaje} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.tipoViaje}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.tipoViaje && <ErrorText>{errors.tipoViaje}</ErrorText>}
    </Grid>
  </Grid>
);

export default ViajeForm;