import {
  Grid, InputLabel, TextField, Box, Typography, List, ListItem,
  ListItemText, CircularProgress, IconButton, Modal, Button,
  Paper, Select, MenuItem, FormControl, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, Stack
} from '@mui/material';
import { useEffect, useState } from 'react';
import { 
  Search, Close, Business, DirectionsCar, Person, 
  LocationOn, Info 
} from '@mui/icons-material';
import axios from 'axios';
import ErrorText from '../ErrorText';

const useDebouncedFetch = (url, paramName, value, setData, setLoading, extraParams = {}) => {
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, { params: { [paramName]: value, activo: true, ...extraParams } });
        setData(response.data);
      } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(() => value.length > 0 || value.length === 0 ? fetchData() : null, 500);
    return () => clearTimeout(timer);
  }, [value, JSON.stringify(extraParams)]);
};

const LabeledTextField = ({ name, label, value, onChange, onBlur, error, readOnly = false, placeholder = '', type = 'text' }) => (
  <Box className="fieldContainer">
    <InputLabel required className="requiredLabel">{label}</InputLabel>
    <TextField fullWidth size="small" name={name} type={type} value={value || ''} onChange={onChange} onBlur={onBlur}
      error={!!error} placeholder={placeholder} InputProps={readOnly ? { readOnly: true } : {}} />
    {error && <ErrorText>{error}</ErrorText>}
  </Box>
);

const DetailModal = ({ open, onClose, title, item, fields }) => !item ? null : (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {fields.map(({ label, value, render }) => (
          <Box key={label}>
            <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
            <Typography variant="body1">{render ? render(item) : value.split('.').reduce((o, i) => o?.[i], item)}</Typography>
          </Box>
        ))}
      </Stack>
    </DialogContent>
    <DialogActions><Button onClick={onClose}>Cerrar</Button></DialogActions>
  </Dialog>
);

const SelectionModal = ({ open, onClose, title, items, onSelect, searchValue, onSearchChange, loading, 
  getText, getSecondaryText, getThirdText, emptyText, icon: Icon, detailFields, showSearch = true }) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Paper variant="selectionModal">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {Icon && <Icon color="primary" />}
              <Typography variant="h6" color="primary">{title}</Typography>
            </Box>
            <IconButton onClick={onClose} size="small"><Close /></IconButton>
          </Box>

          {showSearch && (
            <TextField fullWidth value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar..."
              size="small" InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }} sx={{ mb: 2 }} />
          )}

          <Paper variant="modalContent">
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress size={24} /></Box>
            ) : items.length > 0 ? (
              <List className="selectionList">
                {items.map((item) => (
                  <ListItem key={item._id} variant="selectableItem" onClick={() => { onSelect(item); onClose(); }}
                    secondaryAction={detailFields && (
                      <IconButton edge="end" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setDetailModalOpen(true); }}>
                        <Info color="primary" />
                      </IconButton>
                    )}>
                    <ListItemText
                      primary={<Typography fontWeight="medium">{getText(item)}</Typography>}
                      secondary={<>
                        <Typography variant="body2" color="text.secondary">{getSecondaryText?.(item)}</Typography>
                        {getThirdText && <Typography variant="body2" color="text.secondary">{getThirdText(item)}</Typography>}
                      </>}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">{emptyText}</Typography>
              </Box>
            )}
          </Paper>
        </Paper>
      </Modal>

      {detailFields && (
        <DetailModal open={detailModalOpen} onClose={() => setDetailModalOpen(false)} title={`Detalle de ${title}`}
          item={selectedItem} fields={detailFields} />
      )}
    </>
  );
};

const ViajeForm = ({ formData = {}, handleChange, handleBlur, errors, isEditing = false }) => {
  const normalizedFormData = {
    depositoOrigen: formData.depositoOrigen || null,
    depositoDestino: formData.depositoDestino || null,
    empresaTransportista: formData.empresaTransportista || null,
    choferAsignado: formData.choferAsignado || null,
    vehiculoAsignado: formData.vehiculoAsignado || null,
    tipoViaje: formData.tipoViaje || '',
    fechaInicio: formData.fechaInicio || '',
    fechaFin: formData.fechaFin || ''
  };

  // Estados separados para depósitos origen y destino
  const [origenData, setOrigenData] = useState({
    depositos: [],
    loading: false,
    searchValue: '',
    modalOpen: false
  });

  const [destinoData, setDestinoData] = useState({
    depositos: [],
    loading: false,
    searchValue: '',
    modalOpen: false
  });

  // Estados para otros componentes
  const [data, setData] = useState({
    empresas: [], 
    choferes: [], 
    vehiculos: []
  });

  const [inputValues, setInputValues] = useState({
    empresa: '', 
    chofer: '', 
    vehiculo: ''
  });

  const [loading, setLoading] = useState({
    empresas: false, 
    choferes: false, 
    vehiculos: false
  });

  const [modals, setModals] = useState({
    empresas: false, 
    choferes: false, 
    vehiculos: false
  });

  const [vehicleDetail, setVehicleDetail] = useState({ open: false, item: null });

  // Efecto para determinar tipo de viaje
  useEffect(() => {
    if (formData.depositoOrigen?.localizacion?.pais && formData.depositoDestino?.localizacion?.pais) {
      const isNacional = formData.depositoOrigen.localizacion.pais === 'Argentina' && 
                       formData.depositoDestino.localizacion.pais === 'Argentina';
      handleChange({ target: { name: 'tipoViaje', value: isNacional ? 'Nacional' : 'Internacional' } });
    }
  }, [formData.depositoOrigen, formData.depositoDestino]);

  // Funciones para manejar depósitos
  const fetchDepositos = async (type) => {
    const stateUpdater = type === 'origen' ? setOrigenData : setDestinoData;
    const searchValue = type === 'origen' ? origenData.searchValue : destinoData.searchValue;
    
    stateUpdater(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await axios.get('/api/depositos', { 
        params: { 
          direccion: searchValue,
          activo: true 
        }
      });
      
      stateUpdater(prev => ({ 
        ...prev, 
        depositos: response.data,
        loading: false 
      }));
    } catch (error) {
      console.error(`Error al cargar depósitos ${type}:`, error);
      stateUpdater(prev => ({ ...prev, loading: false }));
    }
  };

  const handleOpenOrigenModal = () => {
    setOrigenData(prev => ({ ...prev, modalOpen: true }));
    if (origenData.depositos.length === 0) {
      fetchDepositos('origen');
    }
  };

  const handleOpenDestinoModal = () => {
    setDestinoData(prev => ({ ...prev, modalOpen: true }));
    if (destinoData.depositos.length === 0) {
      fetchDepositos('destino');
    }
  };

  const handleOrigenSearchChange = (value) => {
    setOrigenData(prev => ({ ...prev, searchValue: value }));
    if (value.length > 2 || value.length === 0) {
      fetchDepositos('origen');
    }
  };

  const handleDestinoSearchChange = (value) => {
    setDestinoData(prev => ({ ...prev, searchValue: value }));
    if (value.length > 2 || value.length === 0) {
      fetchDepositos('destino');
    }
  };

  // Funciones para otros componentes
  useDebouncedFetch('/api/empresas', 'nombre', inputValues.empresa, 
    (data) => setData(prev => ({...prev, empresas: data})), 
    (isLoading) => setLoading(prev => ({...prev, empresas: isLoading}))
  );

  useDebouncedFetch('/api/choferes', 'nombre', inputValues.chofer, 
    (data) => {
      const filtered = formData.empresaTransportista?._id 
        ? data.filter(c => c.empresa?._id === formData.empresaTransportista._id)
        : data;
      setData(prev => ({...prev, choferes: filtered}));
    }, 
    (isLoading) => setLoading(prev => ({...prev, choferes: isLoading})),
    { empresa: formData.empresaTransportista?._id }
  );

  useDebouncedFetch('/api/vehiculos', 'patente', inputValues.vehiculo, 
    (data) => setData(prev => ({...prev, vehiculos: data})), 
    (isLoading) => setLoading(prev => ({...prev, vehiculos: isLoading})),
    { empresa: formData.empresaTransportista?._id }
  );

  useEffect(() => {
    if (!isEditing) return;
    
    const fetchInitialData = async () => {
      try {
        const fetchAndUpdate = async (endpoint, field) => {
          if (normalizedFormData[field] && typeof normalizedFormData[field] === 'string') {
            const res = await axios.get(`/api/${endpoint}/${normalizedFormData[field]}`, { 
              params: { activo: true } 
            });
            handleChange({ target: { name: field, value: res.data } });
          }
        };

        await Promise.all([
          fetchAndUpdate('choferes', 'choferAsignado'),
          fetchAndUpdate('vehiculos', 'vehiculoAsignado'),
          fetchAndUpdate('empresas', 'empresaTransportista'),
          fetchAndUpdate('depositos', 'depositoOrigen'),
          fetchAndUpdate('depositos', 'depositoDestino')
        ]);
        
        setInputValues(prev => ({
          ...prev,
          empresa: normalizedFormData.empresaTransportista?.nombre_empresa || '',
          chofer: normalizedFormData.choferAsignado ? 
            `${normalizedFormData.choferAsignado.nombre} ${normalizedFormData.choferAsignado.apellido}` : '',
          vehiculo: normalizedFormData.vehiculoAsignado?.patente || ''
        }));
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    
    fetchInitialData();
  }, [isEditing]);

  const handleInputChange = (key, value) => setInputValues(prev => ({ ...prev, [key]: value }));
  const toggleModal = (key) => setModals(prev => ({ ...prev, [key]: !prev[key] }));

  const validateDates = () => {
    if (formData.fechaInicio && formData.fechaFin && new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      setErrors(prev => ({ ...prev, fechaFin: 'La fecha de fin debe ser posterior a la fecha de inicio' }));
      return false;
    }
    return true;
  };

const handleDateChange = (e) => {
  const { name, value } = e.target;
  handleChange({ 
    target: { 
      name, 
      value: value || ''
    } 
  });
  
  if (name === 'fechaInicio' && formData.fechaFin) {
    validateDates(value, formData.fechaFin);
  } else if (name === 'fechaFin' && formData.fechaInicio) {
    validateDates(formData.fechaInicio, value);
  }
};

const handleChoferChange = (chofer) => {
  handleChange({ target: { name: "choferAsignado", value: chofer } });
  
  if (chofer?.vehiculo_defecto) {
    const vehiculoNormalizado = {
      ...chofer.vehiculo_defecto,
      tipoVehiculo: chofer.vehiculo_defecto.tipo_vehiculo || chofer.vehiculo_defecto.tipo,
      año: chofer.vehiculo_defecto.anio || chofer.vehiculo_defecto.año,
      volumen: chofer.vehiculo_defecto.volumen || chofer.vehiculo_defecto.capacidad_carga?.volumen,
      peso: chofer.vehiculo_defecto.peso || chofer.vehiculo_defecto.capacidad_carga?.peso,
      empresaNombre: chofer.vehiculo_defecto.empresa?.nombre_empresa || chofer.vehiculo_defecto.empresaNombre
    };
    
    handleChange({ target: { name: "vehiculoAsignado", value: vehiculoNormalizado } });
    handleInputChange('vehiculo', chofer.vehiculo_defecto.patente);
  } else {
    handleChange({ target: { name: "vehiculoAsignado", value: null } });
    handleInputChange('vehiculo', '');
  }
};

  const handleEmpresaSelect = (empresa) => {
    if (!empresa?._id) return console.error('Empresa seleccionada sin ID:', empresa);
    handleChange({ target: { name: "empresaTransportista", value: empresa } });
    handleInputChange('empresa', empresa.nombre_empresa);
    handleChange({ target: { name: "choferAsignado", value: null } });
    handleChange({ target: { name: "vehiculoAsignado", value: null } });
    handleInputChange('chofer', ''); 
    handleInputChange('vehiculo', '');
  };

  const handleVehiculoChange = (vehiculo) => handleChange({ target: { name: "vehiculoAsignado", value: vehiculo } });

const formatForDateTimeLocal = (dateString) => {
  if (!dateString || dateString === '') return '';
  
  // Si ya está en formato ISO (de un datetime-local input)
  if (typeof dateString === 'string' && dateString.includes('T')) {
    return dateString;
  }

  try {
    // Si viene del backend en formato DD/MM/YYYY HH:mm
    if (typeof dateString === 'string' && dateString.includes('/')) {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart?.split(':') || ['00', '00'];
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }

    // Si es un objeto Date o timestamp
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

  const renderDepositoField = (type, label, value, error, onOpenModal) => (
    <Box className="fieldContainer">
      <InputLabel required className="requiredLabel">{label}</InputLabel>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField 
          fullWidth 
          size="small" 
          value={value || ''}
          InputProps={{
            readOnly: true,
            startAdornment: value && <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
          }} 
        />
        <IconButton onClick={onOpenModal} variant="searchButton">
          <Search />
        </IconButton>
      </Box>
      {error && <ErrorText>{error}</ErrorText>}
    </Box>
  );

  const renderSearchField = (field, label, icon, value, modalKey, error) => (
    <Box className="fieldContainer">
      <InputLabel required className="requiredLabel">{label}</InputLabel>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField fullWidth size="small" value={value} InputProps={{
          readOnly: true,
          startAdornment: value && <icon.type {...icon.props} sx={{ mr: 1, color: 'primary.main' }} />
        }} />
        <IconButton onClick={() => toggleModal(modalKey)} variant="searchButton">
          <Search />
        </IconButton>
      </Box>
      {error && <ErrorText>{error}</ErrorText>}
    </Box>
  );

  return (
    <Box className="formContainer">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className="formSectionTitle">Información del Viaje</Typography>

<LabeledTextField 
  name="fechaInicio" 
  label="Fecha y Hora de Inicio" 
  type="datetime-local"
  value={formatForDateTimeLocal(normalizedFormData.fechaInicio)}
  onChange={handleDateChange}
  onBlur={handleBlur}
  error={errors.fechaInicio}
  InputLabelProps={{ shrink: true }}
/>

<LabeledTextField 
  name="fechaFin" 
  label="Fecha y Hora de Fin" 
  type="datetime-local"
  value={formatForDateTimeLocal(normalizedFormData.fechaFin)}
  onChange={handleDateChange}
  onBlur={handleBlur}
  error={errors.fechaFin}
  InputLabelProps={{ shrink: true }}
/>

          {renderDepositoField(
            'origen',
            'Depósito de Origen',
            normalizedFormData.depositoOrigen?.localizacion?.direccion,
            errors.depositoOrigen,
            handleOpenOrigenModal
          )}

          <SelectionModal 
            open={origenData.modalOpen} 
            onClose={() => setOrigenData(prev => ({ ...prev, modalOpen: false }))}
            title="Seleccionar Depósito de Origen" 
            items={origenData.depositos}
            onSelect={(deposito) => {
              handleChange({ target: { name: "depositoOrigen", value: deposito } });
              setOrigenData(prev => ({ ...prev, modalOpen: false }));
            }}
            searchValue={origenData.searchValue} 
            onSearchChange={handleOrigenSearchChange}
            loading={origenData.loading} 
            getText={(item) => item.localizacion?.direccion}
            getSecondaryText={(item) => `${item.localizacion?.ciudad}, ${item.localizacion?.pais}`}
            emptyText="No hay depósitos disponibles" 
            icon={LocationOn}
            detailFields={[
              { label: 'Dirección', value: 'localizacion.direccion' },
              { label: 'Ciudad', value: 'localizacion.ciudad' },
              { label: 'Provincia', value: 'localizacion.provincia_estado' },
              { label: 'País', value: 'localizacion.pais' },
              { label: 'Tipo', value: 'tipo' },
              { label: 'Horarios', render: (item) => 
                `${item.horarios?.desde} - ${item.horarios?.hasta} (${item.horarios?.dias?.join(', ')})` 
              }
            ]} 
          />

          {renderDepositoField(
            'destino',
            'Depósito de Destino',
            normalizedFormData.depositoDestino?.localizacion?.direccion,
            errors.depositoDestino,
            handleOpenDestinoModal
          )}

          <SelectionModal 
            open={destinoData.modalOpen} 
            onClose={() => setDestinoData(prev => ({ ...prev, modalOpen: false }))}
            title="Seleccionar Depósito de Destino" 
            items={destinoData.depositos}
            onSelect={(deposito) => {
              handleChange({ target: { name: "depositoDestino", value: deposito } });
              setDestinoData(prev => ({ ...prev, modalOpen: false }));
            }}
            searchValue={destinoData.searchValue} 
            onSearchChange={handleDestinoSearchChange}
            loading={destinoData.loading} 
            getText={(item) => item.localizacion?.direccion}
            getSecondaryText={(item) => `${item.localizacion?.ciudad}, ${item.localizacion?.pais}`}
            emptyText="No hay depósitos disponibles" 
            icon={LocationOn}
            detailFields={[
              { label: 'Dirección', value: 'localizacion.direccion' },
              { label: 'Ciudad', value: 'localizacion.ciudad' },
              { label: 'Provincia', value: 'localizacion.provincia_estado' },
              { label: 'País', value: 'localizacion.pais' },
              { label: 'Tipo', value: 'tipo' },
              { label: 'Horarios', render: (item) => 
                `${item.horarios?.desde} - ${item.horarios?.hasta} (${item.horarios?.dias?.join(', ')})` 
              }
            ]} 
          />

          <FormControl fullWidth className="fieldContainer">
            <InputLabel required className="requiredLabel">Tipo de Viaje</InputLabel>
            <Select value={normalizedFormData.tipoViaje || ''} onChange={handleChange} name="tipoViaje"
              error={!!errors.tipoViaje} disabled={true} IconComponent={() => null}>
              <MenuItem value="" disabled>Seleccione un tipo</MenuItem>
              <MenuItem value="Nacional">Nacional</MenuItem>
              <MenuItem value="Internacional">Internacional</MenuItem>
            </Select>
            {errors.tipoViaje && <ErrorText>{errors.tipoViaje}</ErrorText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className="formSectionTitle">Información de Transporte</Typography>

          {renderSearchField('empresaTransportista', 'Empresa Transportista', <Business />, 
            normalizedFormData.empresaTransportista?.nombre_empresa, 'empresas', errors.empresaTransportista)}

          <SelectionModal open={modals.empresas} onClose={() => toggleModal('empresas')}
            title="Seleccionar Empresa Transportista" items={data.empresas} onSelect={handleEmpresaSelect}
            searchValue={inputValues.empresa} onSearchChange={(val) => handleInputChange('empresa', val)}
            loading={loading.empresas} getText={(item) => item.nombre_empresa}
            getSecondaryText={(item) => `CUIT: ${item.cuit}`} emptyText="No hay empresas disponibles"
            icon={Business} detailFields={[
              { label: 'Nombre', value: 'nombre_empresa' },
              { label: 'CUIT', value: 'cuit' },
              { label: 'Teléfono', value: 'datos_contacto.telefono' },
              { label: 'Email', value: 'datos_contacto.mail' },
              { label: 'Dirección', render: (item) => 
                `${item.domicilio_fiscal?.direccion}, ${item.domicilio_fiscal?.ciudad}, ${item.domicilio_fiscal?.provincia_estado}, ${item.domicilio_fiscal?.pais}`
              }
            ]} />

          <Box className="fieldContainer">
            <InputLabel required className="requiredLabel">Chofer Asignado</InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField fullWidth size="small" value={
                !normalizedFormData.choferAsignado ? '' :
                  `${normalizedFormData.choferAsignado.nombre} ${normalizedFormData.choferAsignado.apellido}`
              } InputProps={{
                readOnly: true,
                startAdornment: normalizedFormData.choferAsignado && <Person sx={{ mr: 1, color: 'primary.main' }} />
              }} />
              <IconButton onClick={() => toggleModal('choferes')} variant="searchButton"
                disabled={!formData.empresaTransportista}>
                <Search />
              </IconButton>
            </Box>
            {errors.choferAsignado && <ErrorText>{errors.choferAsignado}</ErrorText>}
          </Box>

          <SelectionModal open={modals.choferes} onClose={() => toggleModal('choferes')}
            title="Seleccionar Chofer" items={data.choferes} onSelect={handleChoferChange}
            searchValue={inputValues.chofer} onSearchChange={(val) => handleInputChange('chofer', val)}
            loading={loading.choferes} getText={(item) => `${item.nombre} ${item.apellido}`}
            getSecondaryText={(item) => `CUIL: ${item.cuil}`}
            getThirdText={(item) => item.vehiculo_defecto ? `Vehículo: ${item.vehiculo_defecto.patente}` : 'Sin vehículo asignado'}
            emptyText="No hay choferes disponibles" icon={Person} detailFields={[
              { label: 'Nombre', value: 'nombre' },
              { label: 'Apellido', value: 'apellido' },
              { label: 'CUIL', value: 'cuil' },
              { label: 'Empresa', value: 'empresa.nombre_empresa' },
              { label: 'Vehículo Asignado', render: (item) => 
                item.vehiculo_defecto ? `${item.vehiculo_defecto.patente} - ${item.vehiculo_defecto.marca} ${item.vehiculo_defecto.modelo}` : 'Ninguno'
              },
              { label: 'Licencia', render: (item) => 
                item.licenciaNumero ? `${item.licenciaNumero} (${item.licenciaTipo?.join(', ') || 'Sin tipo'})` : 'Sin licencia registrada'
              },
              { label: 'Fecha Expiración Licencia', render: (item) => 
                item.licenciaExpiracion ? new Date(item.licenciaExpiracion).toLocaleDateString() : 'No especificada'
              }
            ]} />

          <Box className="fieldContainer">
            <InputLabel required className="requiredLabel">Vehículo Asignado</InputLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField fullWidth size="small" value={!normalizedFormData.vehiculoAsignado ? '' : normalizedFormData.vehiculoAsignado.patente}
                InputProps={{
                  readOnly: true,
                  startAdornment: normalizedFormData.vehiculoAsignado && <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
                }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViajeForm;