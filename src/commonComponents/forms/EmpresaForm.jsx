import { InputLabel, TextField, Grid, Box, Typography } from '@mui/material';
import { grey, indigo } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import Avatar from '@mui/material/Avatar';
import BusinessIcon from '@mui/icons-material/Business';

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
    <Box sx={{ p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 1,
        pt: 1,
      }}>
      </Box>
      
      <Grid container spacing={2}>
        {/* Columna 1 */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
            Información básica
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ 
              color: grey[700], 
              fontWeight: 'bold',
              mb: 0.5
            }}>
              Razón Social
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="nombre_empresa"
              value={formData.nombre_empresa || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.nombre_empresa}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: grey[300]
                  }
                }
              }}
            />
            {errors.nombre_empresa && <ErrorText>{errors.nombre_empresa}</ErrorText>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ 
              color: grey[700], 
              fontWeight: 'bold',
              mb: 0.5
            }}>
              CUIT
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="cuit"
              value={formData.cuit || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.cuit}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: grey[300]
                  }
                }
              }}
            />
            {errors.cuit && <ErrorText>{errors.cuit}</ErrorText>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ 
              color: grey[700], 
              fontWeight: 'bold',
              mb: 0.5
            }}>
              Email
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="datos_contacto.mail"
              value={formData.datos_contacto?.mail || ''}
              onChange={(e) => handleNestedChange('datos_contacto', 'mail', e.target.value)}
              onBlur={handleBlur}
              error={!!errors.datos_contacto?.mail}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: grey[300]
                  }
                }
              }}
              type="email"
            />
            {errors.datos_contacto?.mail && <ErrorText>{errors.datos_contacto.mail}</ErrorText>}
          </Box>
        </Grid>

        {/* Columna 2 */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
            Domicilio fiscal
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ 
              color: grey[700], 
              fontWeight: 'bold',
              mb: 0.5
            }}>
              Calle
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="domicilio_fiscal.calle"
              value={formData.domicilio_fiscal?.calle || ''}
              onChange={(e) => handleNestedChange('domicilio_fiscal', 'calle', e.target.value)}
              onBlur={handleBlur}
              error={!!errors.domicilio_fiscal?.calle}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: grey[300]
                  }
                }
              }}
              placeholder="Nombre de la calle (sin número)"
            />
            {errors.domicilio_fiscal?.calle && <ErrorText>{errors.domicilio_fiscal.calle}</ErrorText>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ 
              color: grey[700], 
              fontWeight: 'bold',
              mb: 0.5
            }}>
              Número
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="domicilio_fiscal.numero"
              value={formData.domicilio_fiscal?.numero || ''}
              onChange={(e) => handleNestedChange('domicilio_fiscal', 'numero', e.target.value)}
              onBlur={handleBlur}
              error={!!errors.domicilio_fiscal?.numero}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: grey[300]
                  }
                }
              }}
              placeholder="Número de calle"
            />
            {errors.domicilio_fiscal?.numero && <ErrorText>{errors.domicilio_fiscal.numero}</ErrorText>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ 
              color: grey[700], 
              fontWeight: 'bold',
              mb: 0.5
            }}>
              Ciudad
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="domicilio_fiscal.ciudad"
              value={formData.domicilio_fiscal?.ciudad || ''}
              onChange={(e) => handleNestedChange('domicilio_fiscal', 'ciudad', e.target.value)}
              onBlur={handleBlur}
              error={!!errors.domicilio_fiscal?.ciudad}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: grey[300]
                  }
                }
              }}
            />
            {errors.domicilio_fiscal?.ciudad && <ErrorText>{errors.domicilio_fiscal.ciudad}</ErrorText>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ 
              color: grey[700], 
              fontWeight: 'bold',
              mb: 0.5
            }}>
              Provincia
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="domicilio_fiscal.provincia"
              value={formData.domicilio_fiscal?.provincia || ''}
              onChange={(e) => handleNestedChange('domicilio_fiscal', 'provincia', e.target.value)}
              onBlur={handleBlur}
              error={!!errors.domicilio_fiscal?.provincia}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: grey[300]
                  }
                }
              }}
            />
            {errors.domicilio_fiscal?.provincia && <ErrorText>{errors.domicilio_fiscal.provincia}</ErrorText>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel required sx={{ 
              color: grey[700], 
              fontWeight: 'bold',
              mb: 0.5
            }}>
              Teléfono
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="datos_contacto.telefono"
              value={formData.datos_contacto?.telefono || ''}
              onChange={(e) => handleNestedChange('datos_contacto', 'telefono', e.target.value)}
              onBlur={handleBlur}
              error={!!errors.datos_contacto?.telefono}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: grey[300]
                  }
                }
              }}
            />
            {errors.datos_contacto?.telefono && <ErrorText>{errors.datos_contacto.telefono}</ErrorText>}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmpresaForm;