import { Grid, InputLabel, TextField, FormControl, MenuItem, Select } from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ChoferForm = ({ 
  formData, 
  handleChange, 
  handleBlur, 
  errors, 
  empresas = [], 
  vehiculos = [] 
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        {/* Columna Izquierda: Datos básicos */}
        <Grid item xs={6}>
          {/* Nombre */}
          <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>
            Nombre*
          </InputLabel>
          <TextField
            fullWidth
            margin="dense"
            name="nombre"
            value={formData.nombre || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.nombre}
            sx={{ backgroundColor: grey[50] }}
          />
          {errors.nombre && <ErrorText>{errors.nombre}</ErrorText>}

          {/* Apellido */}
          <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>
            Apellido*
          </InputLabel>
          <TextField
            fullWidth
            margin="dense"
            name="apellido"
            value={formData.apellido || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.apellido}
            sx={{ backgroundColor: grey[50] }}
          />
          {errors.apellido && <ErrorText>{errors.apellido}</ErrorText>}

          {/* CUIL */}
          <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>
            CUIL*
          </InputLabel>
          <TextField
            fullWidth
            margin="dense"
            name="cuil"
            value={formData.cuil || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.cuil}
            placeholder="XX-XXXXXXXX-X"
            sx={{ backgroundColor: grey[50] }}
          />
          {errors.cuil && <ErrorText>{errors.cuil}</ErrorText>}
        </Grid>

        {/* Columna Derecha: Datos adicionales */}
        <Grid item xs={6}>
          {/* Fecha de Nacimiento */}
          <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>
            Fecha de Nacimiento*
          </InputLabel>
          <DatePicker
            value={formData.fechaNacimiento || null}
            onChange={(date) => handleChange({
              target: {
                name: 'fechaNacimiento',
                value: date
              }
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                error={!!errors.fechaNacimiento}
                sx={{ backgroundColor: grey[50] }}
              />
            )}
          />
          {errors.fechaNacimiento && <ErrorText>{errors.fechaNacimiento}</ErrorText>}

          {/* Empresa (Dropdown) */}
          <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>
            Empresa*
          </InputLabel>
          <FormControl fullWidth margin="dense" sx={{ backgroundColor: grey[50] }}>
            <Select
              name="empresa"
              value={formData.empresa || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.empresa}
            >
              {empresas.map((empresa) => (
                <MenuItem key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.empresa && <ErrorText>{errors.empresa}</ErrorText>}

          {/* Vehículo Asignado (Dropdown) */}
          <InputLabel sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>
            Vehículo Asignado
          </InputLabel>
          <FormControl fullWidth margin="dense" sx={{ backgroundColor: grey[50] }}>
            <Select
              name="vehiculoAsignado"
              value={formData.vehiculoAsignado || ''}
              onChange={handleChange}
            >
              <MenuItem value="">-- Sin asignar --</MenuItem>
              {vehiculos.map((vehiculo) => (
                <MenuItem key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.patente} - {vehiculo.modelo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default ChoferForm;