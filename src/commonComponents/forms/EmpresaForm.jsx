import {
  Grid, InputLabel, TextField, Box, Typography, Avatar
} from '@mui/material';
import { grey, indigo } from "@mui/material/colors";
import BusinessIcon from '@mui/icons-material/Business';
import ErrorText from '../ErrorText';

const EmpresaForm = ({ formData = {}, handleChange, handleBlur, errors = {}, isEditing = false }) => {
  // Asegurar que formData tenga la estructura completa con valores por defecto
  const safeFormData = {
    nombre_empresa: formData.nombre_empresa || '',
    cuit: formData.cuit || '',
    datos_contacto: {
      mail: formData.datos_contacto?.mail || '',
      telefono: formData.datos_contacto?.telefono || '',
      ...formData.datos_contacto
    },
    domicilio_fiscal: {
      calle: formData.domicilio_fiscal?.calle || '',
      ciudad: formData.domicilio_fiscal?.ciudad || '',
      provincia: formData.domicilio_fiscal?.provincia || '',
      pais: formData.domicilio_fiscal?.pais || 'Argentina',
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
    const actualError = nested ? (errors[field]?.[subfield]) : errors[name];

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
      {isEditing && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: indigo[100] }}>
            <BusinessIcon color="primary" />
          </Avatar>
          <Typography variant="h6" color="primary">
            Modificar Empresa: {safeFormData.nombre_empresa}
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
            Información básica
          </Typography>

          {renderField("Razón Social", "nombre_empresa", false, 'text')}
          {renderField("CUIT", "cuit", false, 'text', '00-00000000-0')}
          {renderField("Email", "datos_contacto.mail", true, 'email')}
          {renderField("Teléfono", "datos_contacto.telefono", true, 'tel')}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
            Domicilio fiscal
          </Typography>

          {renderField("Calle", "domicilio_fiscal.calle", true)}
          {renderField("Ciudad", "domicilio_fiscal.ciudad", true)}
          {renderField("Provincia", "domicilio_fiscal.provincia", true)}
          {renderField("País", "domicilio_fiscal.pais", true)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmpresaForm;