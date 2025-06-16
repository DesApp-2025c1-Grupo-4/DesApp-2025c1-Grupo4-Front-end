import { InputLabel, TextField } from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';

const DefaultForm = ({ formData, handleChange, handleBlur, errors }) => (
  <>
    <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Razon Social</InputLabel>
    <TextField 
      fullWidth 
      margin="dense" 
      name="razonSocial" 
      value={formData.razonSocial} 
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!errors.razonSocial}
      sx={{backgroundColor: grey[50]}} 
    />
    {errors.razonSocial && <ErrorText>{errors.razonSocial}</ErrorText>}

    <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>CUIT/RUT</InputLabel>
    <TextField 
      fullWidth 
      margin="dense" 
      name="cuit" 
      value={formData.cuit} 
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!errors.cuit}
      sx={{backgroundColor: grey[50]}} 
    />
    {errors.cuit && <ErrorText>{errors.cuit}</ErrorText>}

    <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Domicilio Fiscal</InputLabel>
    <TextField 
      fullWidth 
      margin="dense" 
      name="domicilio" 
      value={formData.domicilio} 
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!errors.domicilio}
      sx={{backgroundColor: grey[50]}} 
    />
    {errors.domicilio && <ErrorText>{errors.domicilio}</ErrorText>}

    <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Telefono</InputLabel>
    <TextField 
      fullWidth 
      margin="dense" 
      name="telefono" 
      value={formData.telefono} 
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!errors.telefono}
      sx={{backgroundColor: grey[50]}} 
    />
    {errors.telefono && <ErrorText>{errors.telefono}</ErrorText>}
  </>
);

export default DefaultForm;