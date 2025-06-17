import { Grid, InputLabel, TextField } from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';

const DepositoForm = ({ formData, handleChange, handleBlur, errors }) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Tipo de Depósito</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="tipo" 
        value={formData.tipo} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.tipo}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.tipo && <ErrorText>{errors.tipo}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Franja Horaria</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="horarios" 
        value={formData.horarios} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.horarios}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.horarios && <ErrorText>{errors.horarios}</ErrorText>}

      <InputLabel sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Localización</InputLabel>
      <TextField 
        fullWidth 
        required 
        margin="dense" 
        name="calle" 
        label="Calle" 
        value={formData.calle} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.calle}
        sx={{backgroundColor: grey[50], mb: 1}} 
      />
      {errors.calle && <ErrorText>{errors.calle}</ErrorText>}
      
      <TextField 
        fullWidth 
        margin="dense" 
        name="numero" 
        label="Número" 
        value={formData.numero} 
        onChange={handleChange}
        sx={{backgroundColor: grey[50], mb: 1}} 
      />
      
      <TextField 
        fullWidth 
        required 
        margin="dense" 
        name="provincia" 
        label="Provincia/Estado" 
        value={formData.provincia} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.provincia}
        sx={{backgroundColor: grey[50], mb: 1}} 
      />
      {errors.provincia && <ErrorText>{errors.provincia}</ErrorText>}
      
      <TextField 
        fullWidth 
        required 
        margin="dense" 
        name="pais" 
        label="País" 
        value={formData.pais} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.pais}
        sx={{backgroundColor: grey[50], mb: 1}} 
      />
      {errors.pais && <ErrorText>{errors.pais}</ErrorText>}
      
      <TextField 
        fullWidth 
        margin="dense" 
        name="coordenadas" 
        label="Coordenadas (opcional)" 
        value={formData.coordenadas} 
        onChange={handleChange}
        sx={{backgroundColor: grey[50]}} 
      />
    </Grid>

    <Grid item xs={6}>
      <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>Personal de Contacto</InputLabel>
      <TextField 
        fullWidth 
        required 
        margin="dense" 
        name="nombreContacto" 
        label="Nombre" 
        value={formData.nombreContacto} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.nombreContacto}
        sx={{backgroundColor: grey[50], mb: 1}} 
      />
      {errors.nombreContacto && <ErrorText>{errors.nombreContacto}</ErrorText>}
      
      <TextField 
        fullWidth 
        required 
        margin="dense" 
        name="apellidoContacto" 
        label="Apellido" 
        value={formData.apellidoContacto} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.apellidoContacto}
        sx={{backgroundColor: grey[50], mb: 1}} 
      />
      {errors.apellidoContacto && <ErrorText>{errors.apellidoContacto}</ErrorText>}

      <TextField 
        fullWidth 
        required 
        margin="dense" 
        name="telefonoContacto" 
        label="Teléfono" 
        value={formData.telefonoContacto} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.telefonoContacto}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.telefonoContacto && <ErrorText>{errors.telefonoContacto}</ErrorText>}

      <InputLabel sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Información Legal</InputLabel>
      <TextField 
        fullWidth 
        required 
        margin="dense" 
        name="razonSocial" 
        label="Razón Social" 
        value={formData.razonSocial} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.razonSocial}
        sx={{backgroundColor: grey[50], mb: 1}} 
      />
      {errors.razonSocial && <ErrorText>{errors.razonSocial}</ErrorText>}
      
      <TextField 
        fullWidth 
        required 
        margin="dense" 
        name="cuit" 
        label="CUIT/RUT" 
        value={formData.cuit} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.cuit}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.cuit && <ErrorText>{errors.cuit}</ErrorText>}
    </Grid>
  </Grid>
);

export default DepositoForm;