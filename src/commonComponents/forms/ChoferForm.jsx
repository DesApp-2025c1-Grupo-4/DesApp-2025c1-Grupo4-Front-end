import { 
  Grid, 
  InputLabel, 
  TextField, 
  Autocomplete, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  IconButton,
  Collapse,
  Divider
} from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

const ChoferForm = ({ 
  formData, 
  handleChange, 
  handleBlur, 
  errors, 
  empresas: empresasIniciales = [], 
  vehiculos = [],
  isEditing = false
}) => {
  const [showEmpresasList, setShowEmpresasList] = useState(false);
  const [showVehiculosList, setShowVehiculosList] = useState(false);
  const [empresas, setEmpresas] = useState(empresasIniciales);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(vehiculos);
  const [inputValueEmpresa, setInputValueEmpresa] = useState('');
  const [inputValueVehiculo, setInputValueVehiculo] = useState('');
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);

  // Cargar empresas del backend
  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoadingEmpresas(true);
      try {
        const response = await axios.get('/api/empresas', {
          params: { nombre: inputValueEmpresa }
        });
        setEmpresas(response.data);
      } catch (error) {
        console.error('Error al cargar empresas:', error);
      } finally {
        setLoadingEmpresas(false);
      }
    };

    const timer = setTimeout(() => {
      if (inputValueEmpresa.length > 2 || inputValueEmpresa.length === 0) {
        fetchEmpresas();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValueEmpresa]);

  // Cargar vehículos del backend
  useEffect(() => {
    const fetchVehiculos = async () => {
      setLoadingVehiculos(true);
      try {
        const response = await axios.get('/api/vehiculos', {
          params: { patente: inputValueVehiculo }
        });
        setVehiculosDisponibles(response.data);
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
      } finally {
        setLoadingVehiculos(false);
      }
    };

    const timer = setTimeout(() => {
      if (inputValueVehiculo.length > 2 || inputValueVehiculo.length === 0) {
        fetchVehiculos();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValueVehiculo]);

  // Valores actuales
  const empresaActual = formData.empresa || null;
  const vehiculoActual = formData.vehiculoAsignado || null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        {/* Columna Izquierda: Datos básicos */}
        <Grid item xs={6}>
          {isEditing && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Editando chofer: {formData.nombre} {formData.apellido}
            </Typography>
          )}

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
            InputProps={{
              readOnly: isEditing,
            }}
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

          {/* Empresa */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>
                Empresa*
              </InputLabel>
              <IconButton 
                size="small" 
                onClick={() => setShowEmpresasList(!showEmpresasList)}
                sx={{ mt: 1.5 }}
              >
                {showEmpresasList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {showEmpresasList ? 'Ocultar listado' : 'Ver empresas'}
                </Typography>
              </IconButton>
            </Box>

            <Autocomplete
              options={empresas}
              getOptionLabel={(option) => option?.nombre_empresa || ''}
              inputValue={inputValueEmpresa}
              onInputChange={(_, newValue) => setInputValueEmpresa(newValue)}
              value={empresaActual}
              onChange={(_, newValue) => {
                handleChange({
                  target: {
                    name: "empresa",
                    value: newValue || null
                  }
                });
              }}
              loading={loadingEmpresas}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="dense"
                  error={!!errors.empresa}
                  sx={{ backgroundColor: grey[50] }}
                  placeholder="Buscar empresa..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmpresas ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              noOptionsText={
                inputValueEmpresa.length > 0 
                  ? "No se encontraron empresas" 
                  : "Escriba al menos 3 caracteres"
              }
            />
            {errors.empresa && <ErrorText>{errors.empresa}</ErrorText>}

            <Collapse in={showEmpresasList}>
              <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto', border: `1px solid ${grey[300]}`, borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ p: 1, backgroundColor: grey[100], fontWeight: 'bold' }}>
                  Empresas disponibles ({empresas.length})
                </Typography>
                <Divider />
                <List dense>
                  {empresas.length > 0 ? (
                    empresas.map((empresa) => (
                      <ListItem 
                        key={empresa._id} 
                        button
                        onClick={() => {
                          handleChange({
                            target: {
                              name: "empresa",
                              value: empresa
                            }
                          });
                          setShowEmpresasList(false);
                        }}
                      >
                        <ListItemText primary={empresa.nombre_empresa} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No hay empresas disponibles" />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Collapse>
          </Box>

          {/* Vehículo Asignado */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <InputLabel sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>
                Vehículo Asignado
              </InputLabel>
              <IconButton 
                size="small" 
                onClick={() => setShowVehiculosList(!showVehiculosList)}
                sx={{ mt: 1.5 }}
              >
                {showVehiculosList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {showVehiculosList ? 'Ocultar listado' : 'Ver vehículos'}
                </Typography>
              </IconButton>
            </Box>

            <Autocomplete
              options={vehiculosDisponibles}
              getOptionLabel={(option) => option?.patente || '-- Sin asignar --'}
              inputValue={inputValueVehiculo}
              onInputChange={(_, newValue) => setInputValueVehiculo(newValue)}
              value={vehiculoActual}
              onChange={(_, newValue) => {
                handleChange({
                  target: {
                    name: "vehiculoAsignado",
                    value: newValue || null
                  }
                });
              }}
              loading={loadingVehiculos}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="dense"
                  sx={{ backgroundColor: grey[50] }}
                  placeholder="Buscar vehículo..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingVehiculos ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              noOptionsText={
                inputValueVehiculo.length > 0 
                  ? "No se encontraron vehículos" 
                  : "Escriba al menos 3 caracteres"
              }
            />

            <Collapse in={showVehiculosList}>
              <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto', border: `1px solid ${grey[300]}`, borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ p: 1, backgroundColor: grey[100], fontWeight: 'bold' }}>
                  Vehículos disponibles ({vehiculosDisponibles.length})
                </Typography>
                <Divider />
                <List dense>
                  <ListItem 
                    button
                    onClick={() => {
                      handleChange({
                        target: {
                          name: "vehiculoAsignado",
                          value: null
                        }
                      });
                      setShowVehiculosList(false);
                    }}
                  >
                    <ListItemText primary="-- Sin asignar --" />
                  </ListItem>
                  {vehiculosDisponibles.map((vehiculo) => (
                    <ListItem 
                      key={vehiculo._id} 
                      button
                      onClick={() => {
                        handleChange({
                          target: {
                            name: "vehiculoAsignado",
                            value: vehiculo
                          }
                        });
                        setShowVehiculosList(false);
                      }}
                    >
                      <ListItemText 
                        primary={`${vehiculo.patente} - ${vehiculo.marca} ${vehiculo.modelo}`} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </Box>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default ChoferForm;