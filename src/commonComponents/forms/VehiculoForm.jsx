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
  MenuItem, 
  Collapse, 
  IconButton,
  Divider
} from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const VehiculoForm = ({ 
  formData, 
  handleChange, 
  handleBlur, 
  errors, 
  isEditing = false 
}) => {
  // Estados para autocompletado de empresas
  const [empresas, setEmpresas] = useState([]);
  const [inputValueEmpresa, setInputValueEmpresa] = useState('');
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [showEmpresasList, setShowEmpresasList] = useState(false);

  // Obtener empresas del backend
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        {/* --- Sección 1: Identificación --- */}
        {isEditing && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Editando vehículo: {formData.patente}
          </Typography>
        )}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>Patente</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="patente"
          value={formData.patente || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.patente}
          sx={{ backgroundColor: grey[50] }}
          placeholder="Ej: AA123BB"
          InputProps={{
            readOnly: isEditing,
          }}
        />
        {errors.patente && <ErrorText>{errors.patente}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Tipo de Vehículo</InputLabel>
        <TextField
          select
          fullWidth
          margin="dense"
          name="tipoVehiculo"
          value={formData.tipoVehiculo || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.tipoVehiculo}
          sx={{ backgroundColor: grey[50] }}
        >
          <MenuItem value="" disabled>Seleccione un tipo</MenuItem>
          {['Camión', 'Camioneta', 'Furgón', 'Auto', 'Moto'].map((tipo) => (
            <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
          ))}
        </TextField>
        {errors.tipoVehiculo && <ErrorText>{errors.tipoVehiculo}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Marca</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="marca"
          value={formData.marca || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.marca}
          sx={{ backgroundColor: grey[50] }}
          placeholder="Ej: Ford, Toyota"
        />
        {errors.marca && <ErrorText>{errors.marca}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Modelo</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="modelo"
          value={formData.modelo || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.modelo}
          sx={{ backgroundColor: grey[50] }}
          placeholder="Ej: Focus, Hilux"
        />
        {errors.modelo && <ErrorText>{errors.modelo}</ErrorText>}
      </Grid>

      <Grid item xs={6}>
        {/* --- Sección 2: Capacidades --- */}
        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>Capacidad (Volumen)</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="volumen"
          value={formData.volumen || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.volumen}
          sx={{ backgroundColor: grey[50] }}
          type="number"
          InputProps={{
            endAdornment: <span>m³</span>,
          }}
          helperText={isEditing ? `Actual: ${formData.volumenOriginal || 'N/D'}` : undefined}
        />
        {errors.volumen && <ErrorText>{errors.volumen}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Capacidad (Peso)</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="peso"
          value={formData.peso || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.peso}
          sx={{ backgroundColor: grey[50] }}
          type="number"
          InputProps={{
            endAdornment: <span>kg</span>,
          }}
          helperText={isEditing ? `Actual: ${formData.pesoOriginal || 'N/D'}` : undefined}
        />
        {errors.peso && <ErrorText>{errors.peso}</ErrorText>}

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Año</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          name="año"
          value={formData.año || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.año}
          sx={{ backgroundColor: grey[50] }}
          type="number"
          inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
          placeholder={`Ej: ${new Date().getFullYear()}`}
        />
        {errors.año && <ErrorText>{errors.año}</ErrorText>}

        {/* --- Autocompletado para Empresa con listado --- */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>Empresa</InputLabel>
            <IconButton 
              size="small" 
              onClick={() => setShowEmpresasList(!showEmpresasList)}
              sx={{ mt: 1.5 }}
            >
              {showEmpresasList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {showEmpresasList ? 'Ocultar listado' : 'Ver empresas disponibles'}
              </Typography>
            </IconButton>
          </Box>

          <Autocomplete
            freeSolo
            options={empresas}
            getOptionLabel={(option) => option.nombre_empresa || option}
            inputValue={inputValueEmpresa}
            onInputChange={(_, newValue) => setInputValueEmpresa(newValue)}
            value={formData.empresa || null}
            onChange={(_, newValue) => {
              handleChange({
                target: {
                  name: "empresa",
                  value: newValue?.nombre_empresa || newValue || ""
                }
              });
            }}
            loading={loadingEmpresas}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                name="empresa"
                error={!!errors.empresa}
                sx={{ backgroundColor: grey[50] }}
                placeholder="Escriba para buscar..."
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
                      key={empresa.id} 
                      button
                      onClick={() => {
                        handleChange({
                          target: {
                            name: "empresa",
                            value: empresa.nombre_empresa
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
      </Grid>
    </Grid>
  );
};

export default VehiculoForm;