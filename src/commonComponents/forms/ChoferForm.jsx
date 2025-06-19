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

const useDebouncedFetch = (url, paramName, value, setData, setLoading) => {
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          params: { [paramName]: value }
        });
        setData(response.data);
      } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (value.length > 2 || value.length === 0) {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);
};

const SearchAutocomplete = ({
  label, placeholder, value, inputValue, onInputChange, onChange,
  options, getOptionLabel, loading, error, noOptionsText
}) => (
  <>
    <InputLabel sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>{label}</InputLabel>
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      inputValue={inputValue}
      onInputChange={(_, newValue) => onInputChange(newValue)}
      value={value}
      onChange={(_, newValue) => onChange(newValue || null)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          margin="dense"
          error={!!error}
          sx={{ backgroundColor: grey[50] }}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      noOptionsText={noOptionsText}
    />
    {error && <ErrorText>{error}</ErrorText>}
  </>
);

const CollapsibleList = ({ open, onToggle, label, items, onItemClick, emptyText, getText }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <InputLabel sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>{label}</InputLabel>
      <IconButton size="small" onClick={onToggle} sx={{ mt: 1.5 }}>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        <Typography variant="caption" sx={{ ml: 0.5 }}>
          {open ? 'Ocultar listado' : `Ver ${label.toLowerCase()}`}
        </Typography>
      </IconButton>
    </Box>
    <Collapse in={open}>
      <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto', border: `1px solid ${grey[300]}`, borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ p: 1, backgroundColor: grey[100], fontWeight: 'bold' }}>
          {label} disponibles ({items.length})
        </Typography>
        <Divider />
        <List dense>
          {items.length > 0 ? (
            items.map((item) => (
              <ListItem key={item._id} button onClick={() => onItemClick(item)}>
                <ListItemText primary={getText(item)} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary={emptyText} />
            </ListItem>
          )}
        </List>
      </Box>
    </Collapse>
  </Box>
);

const ChoferForm = ({
  formData, handleChange, handleBlur, errors,
  empresas: empresasIniciales = [], vehiculos = [], isEditing = false
}) => {
  const [empresas, setEmpresas] = useState(empresasIniciales);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(vehiculos);
  const [inputValueEmpresa, setInputValueEmpresa] = useState('');
  const [inputValueVehiculo, setInputValueVehiculo] = useState('');
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);
  const [showEmpresasList, setShowEmpresasList] = useState(false);
  const [showVehiculosList, setShowVehiculosList] = useState(false);

  useDebouncedFetch('/api/empresas', 'nombre', inputValueEmpresa, setEmpresas, setLoadingEmpresas);
  useDebouncedFetch('/api/vehiculos', 'patente', inputValueVehiculo, setVehiculosDisponibles, setLoadingVehiculos);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {isEditing && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Editando chofer: {formData.nombre} {formData.apellido}
            </Typography>
          )}
          {['nombre', 'apellido', 'cuil'].map((field, i) => (
            <Box key={field} sx={{ mt: i ? 2 : 0 }}>
              <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>{field.charAt(0).toUpperCase() + field.slice(1)}*</InputLabel>
              <TextField
                fullWidth
                margin="dense"
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors[field]}
                placeholder={field === 'cuil' ? 'XX-XXXXXXXX-X' : ''}
                sx={{ backgroundColor: grey[50] }}
                InputProps={field === 'cuil' && isEditing ? { readOnly: true } : {}}
              />
              {errors[field] && <ErrorText>{errors[field]}</ErrorText>}
            </Box>
          ))}
        </Grid>

        <Grid item xs={6}>
          <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>Fecha de Nacimiento*</InputLabel>
          <DatePicker
            value={formData.fechaNacimiento || null}
            onChange={(date) => handleChange({ target: { name: 'fechaNacimiento', value: date } })}
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

          <SearchAutocomplete
            label="Empresa*"
            placeholder="Buscar empresa..."
            value={formData.empresa || null}
            inputValue={inputValueEmpresa}
            onInputChange={setInputValueEmpresa}
            onChange={(val) => handleChange({ target: { name: "empresa", value: val } })}
            options={empresas}
            getOptionLabel={(opt) => opt?.nombre_empresa || ''}
            loading={loadingEmpresas}
            error={errors.empresa}
            noOptionsText={inputValueEmpresa.length > 0 ? "No se encontraron empresas" : "Escriba al menos 3 caracteres"}
          />

          <CollapsibleList
            open={showEmpresasList}
            onToggle={() => setShowEmpresasList(!showEmpresasList)}
            label="Empresas"
            items={empresas}
            onItemClick={(empresa) => {
              handleChange({ target: { name: "empresa", value: empresa } });
              setShowEmpresasList(false);
            }}
            emptyText="No hay empresas disponibles"
            getText={(item) => item.nombre_empresa}
          />

          <SearchAutocomplete
            label="Vehículo Asignado"
            placeholder="Buscar vehículo..."
            value={formData.vehiculoAsignado || null}
            inputValue={inputValueVehiculo}
            onInputChange={setInputValueVehiculo}
            onChange={(val) => handleChange({ target: { name: "vehiculoAsignado", value: val } })}
            options={vehiculosDisponibles}
            getOptionLabel={(opt) => opt?.patente || '-- Sin asignar --'}
            loading={loadingVehiculos}
            error={errors.vehiculoAsignado}
            noOptionsText={inputValueVehiculo.length > 0 ? "No se encontraron vehículos" : "Escriba al menos 3 caracteres"}
          />

          <CollapsibleList
            open={showVehiculosList}
            onToggle={() => setShowVehiculosList(!showVehiculosList)}
            label="Vehículos"
            items={[{ _id: 'null', patente: '-- Sin asignar --', marca: '', modelo: '' }, ...vehiculosDisponibles]}
            onItemClick={(vehiculo) => {
              handleChange({ target: { name: "vehiculoAsignado", value: vehiculo._id === 'null' ? null : vehiculo } });
              setShowVehiculosList(false);
            }}
            emptyText="No hay vehículos disponibles"
            getText={(item) => item.patente === '-- Sin asignar --' ? item.patente : `${item.patente} - ${item.marca} ${item.modelo}`}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default ChoferForm;
