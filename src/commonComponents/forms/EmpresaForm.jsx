import { InputLabel, TextField, Grid } from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';

const EmpresaForm = ({ formData, handleChange, handleBlur, errors }) => {
  // Función para manejar cambios en campos anidados
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

  return (
    <Grid container spacing={2}>
      {/* Columna 1 */}
      <Grid item xs={6}>
        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>Razón Social</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="nombre_empresa"
          value={formData.nombre_empresa || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.nombre_empresa}
          sx={{ backgroundColor: grey[50] }}
        />
        {errors.nombre_empresa && <ErrorText>{errors.nombre_empresa}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>CUIT</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="cuit"
          value={formData.cuit || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.cuit}
          sx={{ backgroundColor: grey[50] }}
        />
        {errors.cuit && <ErrorText>{errors.cuit}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Email</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="datos_contacto.mail"
          value={formData.datos_contacto?.mail || ''}
          onChange={(e) => handleNestedChange('datos_contacto', 'mail', e.target.value)}
          onBlur={handleBlur}
          error={!!errors.datos_contacto?.mail}
          sx={{ backgroundColor: grey[50] }}
          type="email"
        />
        {errors.datos_contacto?.mail && <ErrorText>{errors.datos_contacto.mail}</ErrorText>}
      </Grid>

      {/* Columna 2 */}
      <Grid item xs={6}>
        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>Calle</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="domicilio_fiscal.calle"
          value={formData.domicilio_fiscal?.calle || ''}
          onChange={(e) => handleNestedChange('domicilio_fiscal', 'calle', e.target.value)}
          onBlur={handleBlur}
          error={!!errors.domicilio_fiscal?.calle}
          sx={{ backgroundColor: grey[50] }}
          placeholder="Nombre de la calle (sin número)"
        />
        {errors.domicilio_fiscal?.calle && <ErrorText>{errors.domicilio_fiscal.calle}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Número</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="domicilio_fiscal.numero"
          value={formData.domicilio_fiscal?.numero || ''}
          onChange={(e) => handleNestedChange('domicilio_fiscal', 'numero', e.target.value)}
          onBlur={handleBlur}
          error={!!errors.domicilio_fiscal?.numero}
          sx={{ backgroundColor: grey[50] }}
          placeholder="Número de calle"
        />
        {errors.domicilio_fiscal?.numero && <ErrorText>{errors.domicilio_fiscal.numero}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Ciudad</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="domicilio_fiscal.ciudad"
          value={formData.domicilio_fiscal?.ciudad || ''}
          onChange={(e) => handleNestedChange('domicilio_fiscal', 'ciudad', e.target.value)}
          onBlur={handleBlur}
          error={!!errors.domicilio_fiscal?.ciudad}
          sx={{ backgroundColor: grey[50] }}
        />
        {errors.domicilio_fiscal?.ciudad && <ErrorText>{errors.domicilio_fiscal.ciudad}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Provincia</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="domicilio_fiscal.provincia"
          value={formData.domicilio_fiscal?.provincia || ''}
          onChange={(e) => handleNestedChange('domicilio_fiscal', 'provincia', e.target.value)}
          onBlur={handleBlur}
          error={!!errors.domicilio_fiscal?.provincia}
          sx={{ backgroundColor: grey[50] }}
        />
        {errors.domicilio_fiscal?.provincia && <ErrorText>{errors.domicilio_fiscal.provincia}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Teléfono</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="datos_contacto.telefono"
          value={formData.datos_contacto?.telefono || ''}
          onChange={(e) => handleNestedChange('datos_contacto', 'telefono', e.target.value)}
          onBlur={handleBlur}
          error={!!errors.datos_contacto?.telefono}
          sx={{ backgroundColor: grey[50] }}
        />
        {errors.datos_contacto?.telefono && <ErrorText>{errors.datos_contacto.telefono}</ErrorText>}
      </Grid>
    </Grid>
  );
};

export default EmpresaForm;