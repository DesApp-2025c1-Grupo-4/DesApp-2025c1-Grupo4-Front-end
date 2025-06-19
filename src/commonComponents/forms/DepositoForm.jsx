import { Grid, InputLabel, TextField, Box, Typography, Paper, Avatar } from '@mui/material';
import { grey, indigo } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import BusinessIcon from '@mui/icons-material/Business';

const DepositoForm = ({ formData, handleChange, handleBlur, errors, isEditing = false }) => (
  <Box>
    {isEditing && (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3,
      }}>
        <Avatar sx={{ bgcolor: indigo[100] }}>
          <BusinessIcon color="primary" />
        </Avatar>
        <Typography variant="h6" color="primary">
          Modificar Depósito: {formData.tipo}
        </Typography>
      </Box>
    )}
    
    <Grid container spacing={3}>
      {/* Columna 1: Información del Depósito */}
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Información del Depósito
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <InputLabel required sx={{ 
            color: grey[700], 
            fontWeight: 'bold',
            mb: 0.5
          }}>
            Tipo de Depósito
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            name="tipo"
            value={formData.tipo || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.tipo}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
          {errors.tipo && <ErrorText>{errors.tipo}</ErrorText>}
        </Box>

        <Box sx={{ mb: 2 }}>
          <InputLabel required sx={{ 
            color: grey[700], 
            fontWeight: 'bold',
            mb: 0.5
          }}>
            Franja Horaria
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            name="horarios"
            value={formData.horarios || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.horarios}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
          {errors.horarios && <ErrorText>{errors.horarios}</ErrorText>}
        </Box>

        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Información Legal
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
            name="razonSocial"
            value={formData.razonSocial || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.razonSocial}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
          {errors.razonSocial && <ErrorText>{errors.razonSocial}</ErrorText>}
        </Box>

        <Box sx={{ mb: 2 }}>
          <InputLabel required sx={{ 
            color: grey[700], 
            fontWeight: 'bold',
            mb: 0.5
          }}>
            CUIT/RUT
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
      </Grid>

      {/* Columna 2: Información de Contacto */}
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Información de Contacto
        </Typography>

        <Box sx={{ mb: 2 }}>
          <InputLabel required sx={{ 
            color: grey[700], 
            fontWeight: 'bold',
            mb: 0.5
          }}>
            Nombre
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            name="nombreContacto"
            value={formData.nombreContacto || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.nombreContacto}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
          {errors.nombreContacto && <ErrorText>{errors.nombreContacto}</ErrorText>}
        </Box>

        <Box sx={{ mb: 2 }}>
          <InputLabel required sx={{ 
            color: grey[700], 
            fontWeight: 'bold',
            mb: 0.5
          }}>
            Apellido
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            name="apellidoContacto"
            value={formData.apellidoContacto || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.apellidoContacto}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
          {errors.apellidoContacto && <ErrorText>{errors.apellidoContacto}</ErrorText>}
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
            name="telefonoContacto"
            value={formData.telefonoContacto || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.telefonoContacto}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
          {errors.telefonoContacto && <ErrorText>{errors.telefonoContacto}</ErrorText>}
        </Box>
      </Grid>

      {/* Columna 3: Ubicación */}
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Ubicación
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
            name="calle"
            value={formData.calle || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.calle}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
          {errors.calle && <ErrorText>{errors.calle}</ErrorText>}
        </Box>

        <Box sx={{ mb: 2 }}>
          <InputLabel sx={{ 
            color: grey[700], 
            fontWeight: 'bold',
            mb: 0.5
          }}>
            Número
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            name="numero"
            value={formData.numero || ''}
            onChange={handleChange}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <InputLabel required sx={{ 
            color: grey[700], 
            fontWeight: 'bold',
            mb: 0.5
          }}>
            Provincia/Estado
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            name="provincia"
            value={formData.provincia || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.provincia}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
          {errors.provincia && <ErrorText>{errors.provincia}</ErrorText>}
        </Box>

        <Box sx={{ mb: 2 }}>
          <InputLabel required sx={{ 
            color: grey[700], 
            fontWeight: 'bold',
            mb: 0.5
          }}>
            País
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            name="pais"
            value={formData.pais || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.pais}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
          {errors.pais && <ErrorText>{errors.pais}</ErrorText>}
        </Box>

        <Box sx={{ mb: 2 }}>
          <InputLabel sx={{ 
            color: grey[700], 
            fontWeight: 'bold',
            mb: 0.5
          }}>
            Coordenadas (opcional)
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            name="coordenadas"
            value={formData.coordenadas || ''}
            onChange={handleChange}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: grey[300]
                }
              }
            }}
          />
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export default DepositoForm;