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
  Divider,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

const ViajeForm = ({ 
  formData: initialFormData, 
  handleChange, 
  handleBlur, 
  errors, 
  isEditing = false 
}) => {
  // Estados para los listados
  const [empresas, setEmpresas] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [depositos, setDepositos] = useState([]);
  
  // Estados para mostrar/ocultar listados
  const [showEmpresasList, setShowEmpresasList] = useState(false);
  const [showChoferesList, setShowChoferesList] = useState(false);
  const [showVehiculosList, setShowVehiculosList] = useState(false);
  const [showDepositosList, setShowDepositosList] = useState(false);
  
  // Estados para valores de búsqueda
  const [inputValueEmpresa, setInputValueEmpresa] = useState('');
  const [inputValueChofer, setInputValueChofer] = useState('');
  const [inputValueVehiculo, setInputValueVehiculo] = useState('');
  const [inputValueDeposito, setInputValueDeposito] = useState('');

  // Estados para carga
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingChoferes, setLoadingChoferes] = useState(false);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);
  const [loadingDepositos, setLoadingDepositos] = useState(false);

  // Normalización de datos iniciales
  const [formData, setFormData] = useState(() => {
    const normalized = {
      ...initialFormData,
      // Asegurar compatibilidad con diferentes nombres de campos
      empresaTransportista: initialFormData?.empresaTransportista || initialFormData?.empresa_asignada || null,
      choferAsignado: initialFormData?.choferAsignado || initialFormData?.chofer_asignado || null,
      vehiculoAsignado: initialFormData?.vehiculoAsignado || initialFormData?.vehiculo_asignado || null,
      depositoOrigen: initialFormData?.depositoOrigen || initialFormData?.deposito_origen || null,
      depositoDestino: initialFormData?.depositoDestino || initialFormData?.deposito_destino || null,
      tipoViaje: initialFormData?.tipoViaje || initialFormData?.tipo_viaje || '',
      fechaInicio: initialFormData?.fechaInicio || initialFormData?.inicio_viaje || '',
      fechaFin: initialFormData?.fechaFin || initialFormData?.fin_viaje || ''
    };
    return normalized;
  });

  // Actualizar formData cuando cambien los props
  useEffect(() => {
    setFormData({
      ...initialFormData,
      empresaTransportista: initialFormData?.empresaTransportista || initialFormData?.empresa_asignada || null,
      choferAsignado: initialFormData?.choferAsignado || initialFormData?.chofer_asignado || null,
      vehiculoAsignado: initialFormData?.vehiculoAsignado || initialFormData?.vehiculo_asignado || null,
      depositoOrigen: initialFormData?.depositoOrigen || initialFormData?.deposito_origen || null,
      depositoDestino: initialFormData?.depositoDestino || initialFormData?.deposito_destino || null,
      tipoViaje: initialFormData?.tipoViaje || initialFormData?.tipo_viaje || '',
      fechaInicio: initialFormData?.fechaInicio || initialFormData?.inicio_viaje || '',
      fechaFin: initialFormData?.fechaFin || initialFormData?.fin_viaje || ''
    });
  }, [initialFormData]);

  // Función de handleChange modificada para manejar objetos complejos
  const handleLocalChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    handleChange(event);
  };

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

  // Cargar choferes del backend
  useEffect(() => {
    const fetchChoferes = async () => {
      setLoadingChoferes(true);
      try {
        const response = await axios.get('/api/choferes', {
          params: { nombre: inputValueChofer }
        });
        setChoferes(response.data);
      } catch (error) {
        console.error('Error al cargar choferes:', error);
      } finally {
        setLoadingChoferes(false);
      }
    };

    const timer = setTimeout(() => {
      if (inputValueChofer.length > 2 || inputValueChofer.length === 0) {
        fetchChoferes();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValueChofer]);

  // Cargar vehículos del backend
  useEffect(() => {
    const fetchVehiculos = async () => {
      setLoadingVehiculos(true);
      try {
        const response = await axios.get('/api/vehiculos', {
          params: { patente: inputValueVehiculo }
        });
        setVehiculos(response.data);
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

  // Cargar depósitos del backend
  useEffect(() => {
    const fetchDepositos = async () => {
      setLoadingDepositos(true);
      try {
        const response = await axios.get('/api/depositos', {
          params: { direccion: inputValueDeposito }
        });
        setDepositos(response.data);
      } catch (error) {
        console.error('Error al cargar depósitos:', error);
      } finally {
        setLoadingDepositos(false);
      }
    };

    const timer = setTimeout(() => {
      if (inputValueDeposito.length > 2 || inputValueDeposito.length === 0) {
        fetchDepositos();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValueDeposito]);

  // Formatear fechas para el input datetime-local
  const formatForDateTimeLocal = (dateString) => {
    if (!dateString || dateString === 'Sin fecha') return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const offset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  };

  return (
    <Grid container spacing={2}>
      {/* Columna Izquierda */}
      <Grid item xs={6}>
        {isEditing && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Editando viaje: {formData.guid_viaje || formData._id || 'Nuevo viaje'}
          </Typography>
        )}

        {/* Depósito de Origen */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>
              Depósito de Origen*
            </InputLabel>
            <IconButton 
              size="small" 
              onClick={() => setShowDepositosList(!showDepositosList)}
              sx={{ mt: 1.5 }}
            >
              {showDepositosList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {showDepositosList ? 'Ocultar listado' : 'Ver depósitos'}
              </Typography>
            </IconButton>
          </Box>

          <Autocomplete
            options={depositos}
            getOptionLabel={(option) => option?.localizacion?.direccion || ''}
            inputValue={inputValueDeposito}
            onInputChange={(_, newValue) => setInputValueDeposito(newValue)}
            value={formData.depositoOrigen || null}
            onChange={(_, newValue) => {
              const event = {
                target: {
                  name: "depositoOrigen",
                  value: newValue || null
                }
              };
              handleLocalChange(event);
            }}
            loading={loadingDepositos}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                error={!!errors.depositoOrigen}
                sx={{ backgroundColor: grey[50] }}
                placeholder="Buscar depósito..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingDepositos ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={
              inputValueDeposito.length > 0 
                ? "No se encontraron depósitos" 
                : "Escriba al menos 3 caracteres"
            }
          />
          {errors.depositoOrigen && <ErrorText>{errors.depositoOrigen}</ErrorText>}

          <Collapse in={showDepositosList}>
            <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto', border: `1px solid ${grey[300]}`, borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ p: 1, backgroundColor: grey[100], fontWeight: 'bold' }}>
                Depósitos disponibles ({depositos.length})
              </Typography>
              <Divider />
              <List dense>
                {depositos.length > 0 ? (
                  depositos.map((deposito) => (
                    <ListItem 
                      key={deposito._id} 
                      button
                      onClick={() => {
                        const event = {
                          target: {
                            name: "depositoOrigen",
                            value: deposito
                          }
                        };
                        handleLocalChange(event);
                        setShowDepositosList(false);
                      }}
                    >
                      <ListItemText 
                        primary={deposito.localizacion?.direccion} 
                        secondary={`${deposito.localizacion?.ciudad}, ${deposito.localizacion?.pais}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No hay depósitos disponibles" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Collapse>
        </Box>

        {/* Depósito de Destino */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>
              Depósito de Destino*
            </InputLabel>
            <IconButton 
              size="small" 
              onClick={() => setShowDepositosList(!showDepositosList)}
              sx={{ mt: 1.5 }}
            >
              {showDepositosList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {showDepositosList ? 'Ocultar listado' : 'Ver depósitos'}
              </Typography>
            </IconButton>
          </Box>

          <Autocomplete
            options={depositos}
            getOptionLabel={(option) => option?.localizacion?.direccion || ''}
            inputValue={inputValueDeposito}
            onInputChange={(_, newValue) => setInputValueDeposito(newValue)}
            value={formData.depositoDestino || null}
            onChange={(_, newValue) => {
              const event = {
                target: {
                  name: "depositoDestino",
                  value: newValue || null
                }
              };
              handleLocalChange(event);
            }}
            loading={loadingDepositos}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                error={!!errors.depositoDestino}
                sx={{ backgroundColor: grey[50] }}
                placeholder="Buscar depósito..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingDepositos ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={
              inputValueDeposito.length > 0 
                ? "No se encontraron depósitos" 
                : "Escriba al menos 3 caracteres"
            }
          />
          {errors.depositoDestino && <ErrorText>{errors.depositoDestino}</ErrorText>}

          <Collapse in={showDepositosList}>
            <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto', border: `1px solid ${grey[300]}`, borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ p: 1, backgroundColor: grey[100], fontWeight: 'bold' }}>
                Depósitos disponibles ({depositos.length})
              </Typography>
              <Divider />
              <List dense>
                {depositos.length > 0 ? (
                  depositos.map((deposito) => (
                    <ListItem 
                      key={deposito._id} 
                      button
                      onClick={() => {
                        const event = {
                          target: {
                            name: "depositoDestino",
                            value: deposito
                          }
                        };
                        handleLocalChange(event);
                        setShowDepositosList(false);
                      }}
                    >
                      <ListItemText 
                        primary={deposito.localizacion?.direccion} 
                        secondary={`${deposito.localizacion?.ciudad}, ${deposito.localizacion?.pais}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No hay depósitos disponibles" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Collapse>
        </Box>

        {/* Fecha y Hora de Inicio */}
        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', pt: 2 }}>
          Fecha y Hora de Inicio*
        </InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="fechaInicio" 
          type="datetime-local" 
          value={formatForDateTimeLocal(formData.fechaInicio) || ''} 
          onChange={handleLocalChange}
          onBlur={handleBlur}
          error={!!errors.fechaInicio}
          InputLabelProps={{ shrink: true }}
          sx={{ backgroundColor: grey[50] }} 
        />
        {errors.fechaInicio && <ErrorText>{errors.fechaInicio}</ErrorText>}
      </Grid>

      {/* Columna Derecha */}
      <Grid item xs={6}>
        {/* Fecha y Hora de Fin */}
        <InputLabel sx={{ color: grey[900], fontWeight: 'bold' }}>
          Fecha y Hora de Fin
        </InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="fechaFin" 
          type="datetime-local" 
          value={formatForDateTimeLocal(formData.fechaFin) || ''} 
          onChange={handleLocalChange}
          InputLabelProps={{ shrink: true }}
          sx={{ backgroundColor: grey[50] }} 
        />

        {/* Empresa */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', pt: 2 }}>
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
            value={formData.empresaTransportista || null}
            onChange={(_, newValue) => {
              const event = {
                target: {
                  name: "empresaTransportista",
                  value: newValue || null
                }
              };
              handleLocalChange(event);
            }}
            loading={loadingEmpresas}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                error={!!errors.empresaTransportista}
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
          {errors.empresaTransportista && <ErrorText>{errors.empresaTransportista}</ErrorText>}

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
                        const event = {
                          target: {
                            name: "empresaTransportista",
                            value: empresa
                          }
                        };
                        handleLocalChange(event);
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

        {/* Chofer */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', pt: 2 }}>
              Chofer*
            </InputLabel>
            <IconButton 
              size="small" 
              onClick={() => setShowChoferesList(!showChoferesList)}
              sx={{ mt: 1.5 }}
            >
              {showChoferesList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {showChoferesList ? 'Ocultar listado' : 'Ver choferes'}
              </Typography>
            </IconButton>
          </Box>

          <Autocomplete
            options={choferes}
            getOptionLabel={(option) => `${option.nombre || ''} ${option.apellido || ''}`.trim() || ''}
            inputValue={inputValueChofer}
            onInputChange={(_, newValue) => setInputValueChofer(newValue)}
            value={formData.choferAsignado || null}
            onChange={(_, newValue) => {
              const event = {
                target: {
                  name: "choferAsignado",
                  value: newValue || null
                }
              };
              handleLocalChange(event);
            }}
            loading={loadingChoferes}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                error={!!errors.choferAsignado}
                sx={{ backgroundColor: grey[50] }}
                placeholder="Buscar chofer..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingChoferes ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={
              inputValueChofer.length > 0 
                ? "No se encontraron choferes" 
                : "Escriba al menos 3 caracteres"
            }
          />
          {errors.choferAsignado && <ErrorText>{errors.choferAsignado}</ErrorText>}

          <Collapse in={showChoferesList}>
            <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto', border: `1px solid ${grey[300]}`, borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ p: 1, backgroundColor: grey[100], fontWeight: 'bold' }}>
                Choferes disponibles ({choferes.length})
              </Typography>
              <Divider />
              <List dense>
                {choferes.length > 0 ? (
                  choferes.map((chofer) => (
                    <ListItem 
                      key={chofer._id} 
                      button
                      onClick={() => {
                        const event = {
                          target: {
                            name: "choferAsignado",
                            value: chofer
                          }
                        };
                        handleLocalChange(event);
                        setShowChoferesList(false);
                      }}
                    >
                      <ListItemText 
                        primary={`${chofer.nombre} ${chofer.apellido}`} 
                        secondary={`CUIL: ${chofer.cuil}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No hay choferes disponibles" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Collapse>
        </Box>

        {/* Vehículo */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', pt: 2 }}>
              Vehículo*
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
            options={vehiculos}
            getOptionLabel={(option) => option?.patente || ''}
            inputValue={inputValueVehiculo}
            onInputChange={(_, newValue) => setInputValueVehiculo(newValue)}
            value={formData.vehiculoAsignado || null}
            onChange={(_, newValue) => {
              const event = {
                target: {
                  name: "vehiculoAsignado",
                  value: newValue || null
                }
              };
              handleLocalChange(event);
            }}
            loading={loadingVehiculos}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                error={!!errors.vehiculoAsignado}
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
          {errors.vehiculoAsignado && <ErrorText>{errors.vehiculoAsignado}</ErrorText>}

          <Collapse in={showVehiculosList}>
            <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto', border: `1px solid ${grey[300]}`, borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ p: 1, backgroundColor: grey[100], fontWeight: 'bold' }}>
                Vehículos disponibles ({vehiculos.length})
              </Typography>
              <Divider />
              <List dense>
                {vehiculos.length > 0 ? (
                  vehiculos.map((vehiculo) => (
                    <ListItem 
                      key={vehiculo._id} 
                      button
                      onClick={() => {
                        const event = {
                          target: {
                            name: "vehiculoAsignado",
                            value: vehiculo
                          }
                        };
                        handleLocalChange(event);
                        setShowVehiculosList(false);
                      }}
                    >
                      <ListItemText 
                        primary={vehiculo.patente} 
                        secondary={`${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.tipo_vehiculo})`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No hay vehículos disponibles" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Collapse>
        </Box>

        {/* Tipo de Viaje */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>
            Tipo de Viaje*
          </InputLabel>
          <Select
            value={formData.tipoViaje || ''}
            onChange={handleLocalChange}
            name="tipoViaje"
            error={!!errors.tipoViaje}
            sx={{ backgroundColor: grey[50] }}
          >
            <MenuItem value="" disabled>Seleccione un tipo</MenuItem>
            <MenuItem value="Nacional">Nacional</MenuItem>
            <MenuItem value="Internacional">Internacional</MenuItem>
          </Select>
          {errors.tipoViaje && <ErrorText>{errors.tipoViaje}</ErrorText>}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ViajeForm;