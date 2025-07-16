import { Grid, InputLabel, TextField, Box, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import ErrorText from '../ErrorText';
import { grey } from '@mui/material/colors';

const EmpresaForm = ({ formData = {}, handleChange, handleBlur, errors = {}, isEditing = false }) => {
  const safeFormData = {
    _id: formData._id || '',
    nombre_empresa: formData.nombre_empresa || '',
    cuit: formData.cuit || '',
    datos_contacto: {
      mail: formData.datos_contacto?.mail || '',
      telefono: formData.datos_contacto?.telefono || '',
      ...formData.datos_contacto
    },
    domicilio_fiscal: {
      direccion: formData.domicilio_fiscal?.direccion || '',
      ciudad: formData.domicilio_fiscal?.ciudad || '',
      provincia_estado: formData.domicilio_fiscal?.provincia_estado || '',
      pais: formData.domicilio_fiscal?.pais || '',
      ...formData.domicilio_fiscal
    },
    ...formData
  };

  const handleNestedChange = (field, subfield, value) => {
    handleChange({
      target: {
        name: field,
        value: {
          ...(safeFormData[field] || {}),
          [subfield]: value
        }
      }
    });
  };

  const renderField = (label, name, nested = false, type = 'text', placeholder = '') => {
  const [field, subfield] = name.split('.');
  const actualValue = nested ? (safeFormData[field]?.[subfield] || '') : safeFormData[name];
  
  // Manejo mejorado de errores anidados
  let actualError;
  if (nested) {
    if (errors[field] && typeof errors[field] === 'object') {
      actualError = errors[field][subfield];
    } else if (errors[name]) {
      actualError = errors[name];
    }
  } else {
    actualError = errors[name];
  }

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
        onChange={nested ? (e) => handleNestedChange(field, subfield, e.target.value) : handleChange}
        onBlur={handleBlur}
        error={!!actualError}
        type={type}
        placeholder={placeholder}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': {
              borderColor: grey[300]
            }
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
          <Typography variant="subtitle1" className="formSectionTitle">
            Información básica
          </Typography>
          {renderField("Razón Social", "nombre_empresa")}
          {renderField("CUIT", "cuit", false, 'text', '00-00000000-0')}
          {renderField("Email", "datos_contacto.mail", true, 'email')}
          {renderField("Teléfono", "datos_contacto.telefono", true, 'tel')}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className="formSectionTitle">
            Domicilio fiscal
          </Typography>
          {renderField("Direccion", "domicilio_fiscal.direccion", true)}
          {renderField("Ciudad", "domicilio_fiscal.ciudad", true)}
          {renderField("Provincia / Estado", "domicilio_fiscal.provincia_estado", true)}
          {renderField("País", "domicilio_fiscal.pais", true)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmpresaForm;