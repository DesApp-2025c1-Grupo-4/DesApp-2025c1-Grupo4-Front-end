import { InputLabel, TextField, Grid, Box, Typography } from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';

const EmpresaForm = ({ formData, handleChange, handleBlur, errors }) => {
  const handleNestedChange = (field, subfield, value) => {
    handleChange({
      target: {
        name: field,
        value: {
          ...(formData[field] || {}),
          [subfield]: value
        }
      }
    });
  };

  const renderField = (label, name, value, error, nested = false, type = 'text', placeholder = '') => {
    const [field, subfield] = name.split('.');
    const actualValue = nested ? (formData[field]?.[subfield] || '') : value;
    const actualError = nested ? (errors[field]?.[subfield]) : error;

    return (
      <Box sx={{ mb: 2 }}>
        <InputLabel required sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>
          {label}
        </InputLabel>
        <TextField
          fullWidth
          size="small"
          name={name}
          value={actualValue}
          onChange={nested ? 
            (e) => handleNestedChange(field, subfield, e.target.value) : 
            handleChange}
          onBlur={handleBlur}
          error={!!actualError}
          type={type}
          placeholder={placeholder}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': { borderColor: grey[300] }
            }
          }}
        />
        {actualError && <ErrorText>{actualError}</ErrorText>}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
            Información básica
          </Typography>
          
          {renderField("Razón Social", "nombre_empresa", formData.nombre_empresa, errors.nombre_empresa)}
          {renderField("CUIT", "cuit", formData.cuit, errors.cuit)}
          {renderField("Email", "datos_contacto.mail", null, null, true, 'email')}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
            Domicilio fiscal
          </Typography>
          
          {renderField("Calle", "domicilio_fiscal.calle", null, null, true, 'text', "Nombre de la calle (sin número)")}
          {renderField("Número", "domicilio_fiscal.numero", null, null, true)}
          {renderField("Ciudad", "domicilio_fiscal.ciudad", null, null, true)}
          {renderField("Provincia", "domicilio_fiscal.provincia", null, null, true)}
          {renderField("Teléfono", "datos_contacto.telefono", null, null, true)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmpresaForm;