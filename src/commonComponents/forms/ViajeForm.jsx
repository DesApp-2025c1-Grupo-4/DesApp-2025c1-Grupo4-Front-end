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

    const timer = setTimeout(() => value.length > 2 || value.length === 0 ? fetchData() : null, 500);
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
    ...formData,
    deposito_origen: formData.depositoOrigen?._id || formData.depositoOrigen,
    deposito_destino: formData.depositoDestino?._id || formData.depositoDestino,
    empresa_transportista: formData.empresaTransportista?._id || formData.empresaTransportista,
    chofer_asignado: formData.choferAsignado?._id || formData.choferAsignado,
    vehiculo_asignado: formData.vehiculoAsignado?._id || formData.vehiculoAsignado,
    tipo_viaje: formData.tipoViaje,
    inicio_viaje: formData.fechaInicio,
    fin_viaje: formData.fechaFin
  };

  const [data, setData] = useState({
    empresas: [], choferes: [], vehiculos: [], depositosOrigen: [], depositosDestino: []
  });
  const [inputValues, setInputValues] = useState({
    empresa: '', chofer: '', vehiculo: '', depositoOrigen: '', depositoDestino: ''
  });
  const [loading, setLoading] = useState({
    empresas: false, choferes: false, vehiculos: false, depositosOrigen: false, depositosDestino: false
  });
  const [modals, setModals] = useState({
    empresas: false, choferes: false, vehiculos: false, depositosOrigen: false, depositosDestino: false
  });
  const [vehicleDetail, setVehicleDetail] = useState({ open: false, item: null });

  /*useEffect(() => {
    if (formData.depositoOrigen?.localizacion?.pais && formData.depositoDestino?.localizacion?.pais) {
      const isNacional = formData.depositoOrigen.localizacion.pais === 'Argentina' && 
                         formData.depositoDestino.localizacion.pais === 'Argentina';
      handleChange({ target: { name: 'tipoViaje', value: isNacional ? 'Nacional' : 'Internacional' } });
    }
  }, [formData.depositoOrigen, formData.depositoDestino]);*/

  useEffect(() => {
  const updateTipoViaje = () => {
    const paisOrigen = formData.depositoOrigen?.localizacion?.pais;
    const paisDestino = formData.depositoDestino?.localizacion?.pais;

    if (paisOrigen && paisDestino) {
      const isNacional = paisOrigen === paisDestino;
      handleChange({ 
        target: { 
          name: 'tipoViaje', 
          value: isNacional ? 'Nacional' : 'Internacional' 
        } 
      });
    } else {
      // Resetear si falta algún depósito
      handleChange({ target: { name: 'tipoViaje', value: '' } });
    }
  };

  updateTipoViaje();
}, [formData.depositoOrigen, formData.depositoDestino]);

  

  useDebouncedFetch('/api/empresas', 'nombre', inputValues.empresa, 
    (data) => setData(prev => ({...prev, empresas: data})), 
    (isLoading) => setLoading(prev => ({...prev, empresas: isLoading}))
  );

  useDebouncedFetch('/api/choferes', 'nombre', inputValues.chofer, 
    (data) => setData(prev => ({...prev, choferes: data})), 
    (isLoading) => setLoading(prev => ({...prev, choferes: isLoading})),
    { empresa: formData.empresaTransportista?._id }
  );

  useDebouncedFetch('/api/vehiculos', 'patente', inputValues.vehiculo, 
    (data) => setData(prev => ({...prev, vehiculos: data})), 
    (isLoading) => setLoading(prev => ({...prev, vehiculos: isLoading})),
    { empresa: formData.empresaTransportista?._id }
  );

  useDebouncedFetch('/api/depositos', 'direccion', inputValues.depositoOrigen, 
    (data) => setData(prev => ({...prev, depositosOrigen: data})), 
    (isLoading) => setLoading(prev => ({...prev, depositosOrigen: isLoading}))
  );

  useDebouncedFetch('/api/depositos', 'direccion', inputValues.depositoDestino, 
    (data) => setData(prev => ({...prev, depositosDestino: data})), 
    (isLoading) => setLoading(prev => ({...prev, depositosDestino: isLoading}))
  );

  useEffect(() => {
    if (!isEditing) return;
    
    const fetchInitialData = async () => {
      try {
        const fetchAndUpdate = async (endpoint, field) => {
          if (normalizedFormData[field] && typeof normalizedFormData[field] === 'string') {
            const res = await axios.get(`/api/${endpoint}/${normalizedFormData[field]}`, { params: { activo: true } });
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

  const handleDateChange = (e) => { handleChange(e); setTimeout(validateDates, 100); };

  const handleChoferChange = (chofer) => {
    handleChange({ target: { name: "choferAsignado", value: chofer } });
    if (chofer?.vehiculo_defecto) {
      handleChange({ target: { name: "vehiculoAsignado", value: chofer.vehiculo_defecto } });
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
    handleInputChange('chofer', ''); handleInputChange('vehiculo', '');
  };

  const handleVehiculoChange = (vehiculo) => handleChange({ target: { name: "vehiculoAsignado", value: vehiculo } });

  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    try {
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart?.split(':') || ['00', '00'];
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const offset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

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

          <LabeledTextField name="fechaInicio" label="Fecha y Hora de Inicio" type="datetime-local"
            value={formatForDateTimeLocal(normalizedFormData.fechaInicio)} onChange={handleDateChange}
            onBlur={handleBlur} error={errors.fechaInicio} InputLabelProps={{ shrink: true }} />

          <LabeledTextField name="fechaFin" label="Fecha y Hora de Fin" type="datetime-local"
            value={formatForDateTimeLocal(normalizedFormData.fechaFin)} onChange={handleDateChange}
            onBlur={handleBlur} error={errors.fechaFin} InputLabelProps={{ shrink: true }} />

          {renderSearchField('depositoOrigen', 'Depósito de Origen', <LocationOn />, 
            normalizedFormData.depositoOrigen?.localizacion?.direccion, 'depositosOrigen', errors.depositoOrigen)}

          <SelectionModal open={modals.depositosOrigen} onClose={() => toggleModal('depositosOrigen')}
            title="Seleccionar Depósito de Origen" items={data.depositosOrigen}
            onSelect={(deposito) => {
              handleChange({ target: { name: "depositoOrigen", value: deposito } });
              if (normalizedFormData.depositoDestino?._id === deposito._id) {
                handleChange({ target: { name: "depositoDestino", value: null } });
              }
            }} searchValue={inputValues.depositoOrigen} onSearchChange={(val) => handleInputChange('depositoOrigen', val)}
            loading={loading.depositosOrigen} getText={(item) => item.localizacion?.direccion}
            getSecondaryText={(item) => `${item.localizacion?.ciudad}, ${item.localizacion?.pais}`}
            emptyText="No hay depósitos disponibles" icon={LocationOn}
            detailFields={[
              { label: 'Dirección', value: 'localizacion.direccion' },
              { label: 'Ciudad', value: 'localizacion.ciudad' },
              { label: 'Provincia', value: 'localizacion.provincia_estado' },
              { label: 'País', value: 'localizacion.pais' },
              { label: 'Tipo', value: 'tipo' },
              { label: 'Horarios', render: (item) => 
                `${item.horarios?.desde} - ${item.horarios?.hasta} (${item.horarios?.dias?.join(', ')})` 
              }
            ]} />

          {renderSearchField('depositoDestino', 'Depósito de Destino', <LocationOn />, 
            normalizedFormData.depositoDestino?.localizacion?.direccion, 'depositosDestino', errors.depositoDestino)}
            <SelectionModal 
              open={modals.depositosDestino} 
              onClose={() => toggleModal('depositosDestino')}
              title="Seleccionar Depósito de Destino" 
              items={data.depositosDestino}
              onSelect={(deposito) => {
                handleChange({ target: { name: "depositoDestino", value: deposito } });
                // Validación cruzada 
                if (normalizedFormData.depositoOrigen?._id === deposito._id) {
                  handleChange({ target: { name: "depositoOrigen", value: null } });
                }
              }}
              searchValue={inputValues.depositoDestino}
              onSearchChange={(val) => handleInputChange('depositoDestino', val)}
              loading={loading.depositosDestino}
              getText={(item) => item.localizacion?.direccion}
              getSecondaryText={(item) => `${item.localizacion?.ciudad}, ${item.localizacion?.pais}`}
              emptyText="No hay depósitos disponibles"
              icon={LocationOn}
              detailFields={[
                { label: 'Dirección', value: 'localizacion.direccion' },
                { label: 'Ciudad', value: 'localizacion.ciudad' },
                { label: 'Provincia', value: 'localizacion.provincia_estado' },
                { label: 'País', value: 'localizacion.pais' }
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
              {!normalizedFormData.choferAsignado?.vehiculo_defecto ? (
                <IconButton onClick={() => toggleModal('vehiculos')} variant="searchButton">
                  <Search />
                </IconButton>
              ) : (
                <IconButton onClick={() => setVehicleDetail({ open: true, item: normalizedFormData.vehiculoAsignado })} variant="searchButton">
                  <Info />
                </IconButton>
              )}
            </Box>
            {errors.vehiculoAsignado && <ErrorText>{errors.vehiculoAsignado}</ErrorText>}
          </Box>

          <SelectionModal open={modals.vehiculos} onClose={() => toggleModal('vehiculos')}
            title="Seleccionar Vehículo" items={data.vehiculos} onSelect={handleVehiculoChange}
            searchValue={inputValues.vehiculo} onSearchChange={(val) => handleInputChange('vehiculo', val)}
            loading={loading.vehiculos} getText={(item) => `${item.patente} - ${item.marca} ${item.modelo}`}
            getSecondaryText={(item) => item.empresa ? `Empresa: ${item.empresa.nombre_empresa}` : 'Sin empresa'}
            getThirdText={(item) => `Capacidad: ${item.capacidad_carga?.volumen}m³ / ${item.capacidad_carga?.peso}kg`}
            emptyText="No hay vehículos disponibles" icon={DirectionsCar} detailFields={[
              { label: 'Patente', value: 'patente' },
              { label: 'Marca', value: 'marca' },
              { label: 'Modelo', value: 'modelo' },
              { label: 'Año', value: 'anio' },
              { label: 'Tipo', value: 'tipo_vehiculo' },
              { label: 'Empresa', value: 'empresa.nombre_empresa' },
              { label: 'Capacidad', render: (item) => 
                `${item.capacidad_carga?.volumen}m³ / ${item.capacidad_carga?.peso}kg`
              }
            ]} />
        </Grid>
      </Grid>

      <DetailModal open={vehicleDetail.open} onClose={() => setVehicleDetail({...vehicleDetail, open: false})}
        title="Detalle de Vehículo" item={vehicleDetail.item} fields={[
          { label: 'Patente', value: 'patente' },
          { label: 'Marca', value: 'marca' },
          { label: 'Modelo', value: 'modelo' },
          { label: 'Año', value: 'anio' },
          { label: 'Tipo', value: 'tipo_vehiculo' },
          { label: 'Empresa', value: 'empresa.nombre_empresa' },
          { label: 'Capacidad', render: (item) => 
            `${item.capacidad_carga?.volumen}m³ / ${item.capacidad_carga?.peso}kg`
          }
        ]} />
    </Box>
  );
};

export default ViajeForm;