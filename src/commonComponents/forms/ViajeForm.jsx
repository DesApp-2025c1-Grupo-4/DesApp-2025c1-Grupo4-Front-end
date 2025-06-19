import {
  Grid, InputLabel, TextField, Autocomplete, Box, Typography, List, ListItem, 
  ListItemText, CircularProgress, IconButton, Collapse, Divider, MenuItem, 
  Select, FormControl
} from '@mui/material';
import { grey } from "@mui/material/colors";
import ErrorText from '../ErrorText';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

const useDebouncedFetch = (url, paramName, value, setData, setLoading) => {
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, { params: { [paramName]: value } });
        setData(response.data);
      } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (value.length > 2 || value.length === 0) fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);
};

const SearchAutocomplete = ({
  label, placeholder, value, inputValue, onInputChange, onChange,
  options, getOptionLabel, loading, error, noOptionsText
}) => {
  const getResolvedValue = () => 
    !value ? null : typeof value === 'string' ? options.find(opt => opt._id === value) || null : value;

  return (
    <>
      <InputLabel sx={{ color: grey[900], fontWeight: 'bold', mt: 2 }}>{label}</InputLabel>
      <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        inputValue={inputValue || ''}
        onInputChange={(_, newValue) => onInputChange(newValue)}
        value={getResolvedValue()}
        onChange={(_, newValue) => onChange(newValue || null)}
        loading={loading}
        isOptionEqualToValue={(option, value) => option?._id === value?._id}
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
                  {loading && <CircularProgress color="inherit" size={20} />}
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
};

const CollapsibleList = ({ 
  open, onToggle, label, items, onItemClick, emptyText, getText, getSecondaryText 
}) => (
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
          {items.length > 0 ? items.map((item) => (
            <ListItem key={item._id} button onClick={() => onItemClick(item)}>
              <ListItemText 
                primary={getText(item)} 
                secondary={getSecondaryText?.(item)} 
              />
            </ListItem>
          )) : (
            <ListItem><ListItemText primary={emptyText} /></ListItem>
          )}
        </List>
      </Box>
    </Collapse>
  </Box>
);

const ViajeForm = ({ formData = {}, handleChange, handleBlur, errors, isEditing = false }) => {
  // Normalización de datos
  const normalizedFormData = {
    ...formData,
    tipoViaje: formData.tipo_viaje || formData.tipoViaje,
    fechaInicio: formData.inicio_viaje || formData.fechaInicio,
    fechaFin: formData.fin_viaje || formData.fechaFin,
    depositoOrigen: formData.deposito_origen || formData.depositoOrigen,
    depositoDestino: formData.deposito_destino || formData.depositoDestino,
    empresaTransportista: formData.empresa_asignada || formData.empresaTransportista,
    choferAsignado: formData.chofer_asignado || formData.choferAsignado,
    vehiculoAsignado: formData.vehiculo_asignado || formData.vehiculoAsignado
  };

  // Estados para búsquedas
  const [empresas, setEmpresas] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [depositosOrigen, setDepositosOrigen] = useState([]);
  const [depositosDestino, setDepositosDestino] = useState([]);
  
  const [inputValues, setInputValues] = useState({
    empresa: '', chofer: '', vehiculo: '', depositoOrigen: '', depositoDestino: ''
  });
  
  const [loadingStates, setLoadingStates] = useState({
    empresas: false, choferes: false, vehiculos: false, 
    depositosOrigen: false, depositosDestino: false
  });
  
  const [showLists, setShowLists] = useState({
    empresas: false, choferes: false, vehiculos: false,
    depositosOrigen: false, depositosDestino: false
  });

  // Configuración de búsquedas
  const searchConfigs = [
    { key: 'empresas', url: '/api/empresas', param: 'nombre', inputKey: 'empresa' },
    { key: 'choferes', url: '/api/choferes', param: 'nombre', inputKey: 'chofer' },
    { key: 'vehiculos', url: '/api/vehiculos', param: 'patente', inputKey: 'vehiculo' },
    { key: 'depositosOrigen', url: '/api/depositos', param: 'direccion', inputKey: 'depositoOrigen' },
    { key: 'depositosDestino', url: '/api/depositos', param: 'direccion', inputKey: 'depositoDestino' }
  ];

  // Configurar debounced fetch para cada búsqueda
  searchConfigs.forEach(({ key, url, param, inputKey }) => {
    useDebouncedFetch(
      url, 
      param, 
      inputValues[inputKey], 
      key === 'depositosOrigen' ? setDepositosOrigen : 
      key === 'depositosDestino' ? setDepositosDestino :
      key === 'choferes' ? setChoferes :
      key === 'vehiculos' ? setVehiculos : setEmpresas,
      (loading) => setLoadingStates(prev => ({ ...prev, [key]: loading }))
    );
  });

  // Cargar datos iniciales para edición
  useEffect(() => {
    if (isEditing && normalizedFormData.choferAsignado && typeof normalizedFormData.choferAsignado === 'string') {
      const fetchInitialData = async () => {
        try {
          const res = await axios.get(`/api/choferes/${normalizedFormData.choferAsignado}`);
          handleChange({ target: { name: "choferAsignado", value: res.data } });
        } catch (error) {
          console.error("Error cargando datos iniciales:", error);
        }
      };
      fetchInitialData();
    }
  }, [isEditing]);

  // Handlers optimizados
  const handleInputChange = (key, value) => 
    setInputValues(prev => ({ ...prev, [key]: value }));

  const toggleList = (key) => 
    setShowLists(prev => ({ ...prev, [key]: !prev[key] }));

  const handleChoferChange = (chofer) => {
    handleChange({ target: { name: "choferAsignado", value: chofer } });
    if (chofer?.vehiculoAsignado) {
      handleChange({ target: { name: "vehiculoAsignado", value: chofer.vehiculoAsignado } });
      handleInputChange('vehiculo', chofer.vehiculoAsignado.patente);
      if (chofer.vehiculoAsignado.empresa) {
        handleChange({ target: { name: "empresaTransportista", value: chofer.vehiculoAsignado.empresa } });
        handleInputChange('empresa', chofer.vehiculoAsignado.empresa.nombre_empresa);
      }
    }
  };

  const handleVehiculoChange = (vehiculo) => {
    handleChange({ target: { name: "vehiculoAsignado", value: vehiculo } });
    if (vehiculo?.empresa) {
      handleChange({ target: { name: "empresaTransportista", value: vehiculo.empresa } });
      handleInputChange('empresa', vehiculo.empresa.nombre_empresa);
    }
  };

  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    try {
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart?.split(':') || ['00', '00'];
        const date = new Date(year, month - 1, day, hours, minutes);
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
      }
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
      <Grid item xs={6}>
        {isEditing && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Editando viaje: {normalizedFormData?.idViaje || 'Nuevo viaje'}
          </Typography>
        )}

        <SearchAutocomplete
          label="Depósito de Origen*"
          placeholder="Buscar depósito..."
          value={normalizedFormData.depositoOrigen}
          inputValue={inputValues.depositoOrigen}
          onInputChange={(val) => handleInputChange('depositoOrigen', val)}
          onChange={(val) => handleChange({ target: { name: "depositoOrigen", value: val } })}
          options={depositosOrigen}
          getOptionLabel={(opt) => opt?.localizacion?.direccion || ''}
          loading={loadingStates.depositosOrigen}
          error={errors.depositoOrigen}
          noOptionsText={inputValues.depositoOrigen.length > 0 ? "No se encontraron depósitos" : "Escriba al menos 3 caracteres"}
        />

        <CollapsibleList
          open={showLists.depositosOrigen}
          onToggle={() => toggleList('depositosOrigen')}
          label="Depósitos Origen"
          items={depositosOrigen}
          onItemClick={(deposito) => {
            handleChange({ target: { name: "depositoOrigen", value: deposito } });
            toggleList('depositosOrigen');
          }}
          emptyText="No hay depósitos disponibles"
          getText={(item) => item.localizacion?.direccion}
          getSecondaryText={(item) => `${item.localizacion?.ciudad}, ${item.localizacion?.pais}`}
        />

        <SearchAutocomplete
          label="Depósito de Destino*"
          placeholder="Buscar depósito..."
          value={normalizedFormData.depositoDestino}
          inputValue={inputValues.depositoDestino}
          onInputChange={(val) => handleInputChange('depositoDestino', val)}
          onChange={(val) => {
            if (normalizedFormData.depositoOrigen?._id === val?._id) {
              handleChange({ target: { name: "depositoDestino", value: null } });
              handleInputChange('depositoDestino', '');
              return;
            }
            handleChange({ target: { name: "depositoDestino", value: val } });
          }}
          options={depositosDestino}
          getOptionLabel={(opt) => opt?.localizacion?.direccion || ''}
          loading={loadingStates.depositosDestino}
          error={errors.depositoDestino}
          noOptionsText={inputValues.depositoDestino.length > 0 ? "No se encontraron depósitos" : "Escriba al menos 3 caracteres"}
        />

        <CollapsibleList
          open={showLists.depositosDestino}
          onToggle={() => toggleList('depositosDestino')}
          label="Depósitos Destino"
          items={depositosDestino}
          onItemClick={(deposito) => {
            if (normalizedFormData.depositoOrigen?._id !== deposito?._id) {
              handleChange({ target: { name: "depositoDestino", value: deposito } });
              toggleList('depositosDestino');
            }
          }}
          emptyText="No hay depósitos disponibles"
          getText={(item) => item.localizacion?.direccion}
          getSecondaryText={(item) => `${item.localizacion?.ciudad}, ${item.localizacion?.pais}`}
        />

        <InputLabel required sx={{ color: grey[900], fontWeight: 'bold', pt: 2 }}>
          Fecha y Hora de Inicio*
        </InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="fechaInicio" 
          type="datetime-local" 
          value={formatForDateTimeLocal(normalizedFormData.fechaInicio)} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.fechaInicio}
          InputLabelProps={{ shrink: true }}
          sx={{ backgroundColor: grey[50] }} 
        />
        {errors.fechaInicio && <ErrorText>{errors.fechaInicio}</ErrorText>}
      </Grid>

      <Grid item xs={6}>
        <InputLabel sx={{ color: grey[900], fontWeight: 'bold' }}>
          Fecha y Hora de Fin
        </InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="fechaFin" 
          type="datetime-local" 
          value={formatForDateTimeLocal(normalizedFormData.fechaFin)} 
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ backgroundColor: grey[50] }} 
        />

        <SearchAutocomplete
          label="Empresa Transportista*"
          placeholder="Buscar empresa..."
          value={normalizedFormData.empresaTransportista}
          inputValue={inputValues.empresa}
          onInputChange={(val) => handleInputChange('empresa', val)}
          onChange={(val) => handleChange({ target: { name: "empresaTransportista", value: val } })}
          options={empresas}
          getOptionLabel={(opt) => opt?.nombre_empresa || ''}
          loading={loadingStates.empresas}
          error={errors.empresaTransportista}
          noOptionsText={inputValues.empresa.length > 0 ? "No se encontraron empresas" : "Escriba al menos 3 caracteres"}
        />

        <CollapsibleList
          open={showLists.empresas}
          onToggle={() => toggleList('empresas')}
          label="Empresas"
          items={empresas}
          onItemClick={(empresa) => {
            handleChange({ target: { name: "empresaTransportista", value: empresa } });
            toggleList('empresas');
          }}
          emptyText="No hay empresas disponibles"
          getText={(item) => item.nombre_empresa}
        />

        <SearchAutocomplete
          label="Chofer Asignado*"
          placeholder="Buscar chofer..."
          value={normalizedFormData.choferAsignado}
          inputValue={inputValues.chofer}
          onInputChange={(val) => handleInputChange('chofer', val)}
          onChange={handleChoferChange}
          options={choferes}
          getOptionLabel={(opt) => 
            !opt ? '' : `${opt.nombre || ''} ${opt.apellido || ''}`.trim() + 
            (opt.vehiculoAsignado ? ` (Vehículo: ${opt.vehiculoAsignado.patente})` : '')
          }
          loading={loadingStates.choferes}
          error={errors.choferAsignado}
          noOptionsText={inputValues.chofer.length > 0 ? "No se encontraron choferes" : "Escriba al menos 3 caracteres"}
        />

        <CollapsibleList
          open={showLists.choferes}
          onToggle={() => toggleList('choferes')}
          label="Choferes"
          items={choferes}
          onItemClick={(chofer) => {
            handleChoferChange(chofer);
            toggleList('choferes');
          }}
          emptyText="No hay choferes disponibles"
          getText={(item) => `${item.nombre} ${item.apellido}`}
          getSecondaryText={(item) => item.vehiculoAsignado?.patente && `Vehículo: ${item.vehiculoAsignado.patente}`}
        />

        <SearchAutocomplete
          label="Vehículo Asignado*"
          placeholder="Buscar vehículo..."
          value={normalizedFormData.vehiculoAsignado}
          inputValue={inputValues.vehiculo}
          onInputChange={(val) => handleInputChange('vehiculo', val)}
          onChange={handleVehiculoChange}
          options={vehiculos}
          getOptionLabel={(opt) => 
            !opt ? '' : `${opt.patente} - ${opt.marca} ${opt.modelo}` + 
            (opt.empresa ? ` (Empresa: ${opt.empresa.nombre_empresa})` : '')
          }
          loading={loadingStates.vehiculos}
          error={errors.vehiculoAsignado}
          noOptionsText={inputValues.vehiculo.length > 0 ? "No se encontraron vehículos" : "Escriba al menos 3 caracteres"}
        />

        <CollapsibleList
          open={showLists.vehiculos}
          onToggle={() => toggleList('vehiculos')}
          label="Vehículos"
          items={vehiculos}
          onItemClick={(vehiculo) => {
            handleVehiculoChange(vehiculo);
            toggleList('vehiculos');
          }}
          emptyText="No hay vehículos disponibles"
          getText={(item) => `${item.patente} - ${item.marca} ${item.modelo}`}
          getSecondaryText={(item) => item.empresa?.nombre_empresa && `Empresa: ${item.empresa.nombre_empresa}`}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel required sx={{ color: grey[900], fontWeight: 'bold' }}>
            Tipo de Viaje*
          </InputLabel>
          <Select
            value={normalizedFormData.tipoViaje || ''}
            onChange={handleChange}
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