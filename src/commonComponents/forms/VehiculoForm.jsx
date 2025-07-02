import {
  Grid, TextField, Box, Typography, MenuItem, IconButton,
  Paper, Divider, Modal
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BusinessIcon from '@mui/icons-material/Business';
import Close from '@mui/icons-material/Close';
import Search from '@mui/icons-material/Search';
import FieldContainer from '../formsComponents/FieldContainer';
import IconButtonStyled from '../formsComponents/IconButtonStyled';
import SelectionModal from '../formsComponents/SelectionModal';
import useDebouncedFetch from '../../hooks/useDebouncedFetch';

const TIPOS_VEHICULO = ['Camión', 'Furgón', 'Camioneta', 'Auto', 'Otros'];

const InputField = ({ label, name, value, onChange, onBlur, error, placeholder, type = 'text', helperText, readOnly = false, inputProps, endAdornment }) => (
  <FieldContainer label={label} error={error}>
    <TextField
      fullWidth size="small" name={name} value={value || ''}
      onChange={onChange} onBlur={onBlur} error={!!error}
      placeholder={placeholder} type={type} helperText={helperText}
      InputProps={{ readOnly, endAdornment, inputProps }}
    />
  </FieldContainer>
);

const VehiculoForm = ({ formData, handleChange, handleBlur, errors, isEditing = false }) => {
  const [empresas, setEmpresas] = useState([]);
  const [inputValues, setInputValues] = useState({ empresa: formData?.empresaNombre || '' });
  const [loadingStates, setLoadingStates] = useState({ empresas: false });
  const [modalStates, setModalStates] = useState({ empresas: false });
  const [detailModal, setDetailModal] = useState({ open: false, title: '', content: null });

  useEffect(() => {
    if (isEditing && formData?.empresa) {
      setInputValues(p => ({ ...p, empresa: formData.empresa.nombre_empresa }));
    }
  }, [isEditing, formData?.empresa]);

  useDebouncedFetch(
    '/api/empresas', 'nombre', inputValues.empresa,
    setEmpresas, (loading) => setLoadingStates(p => ({ ...p, empresas: loading }))
  );

  const handleInputChange = (key, value) => setInputValues(p => ({ ...p, [key]: value }));
  const toggleModal = (key) => setModalStates(p => ({ ...p, [key]: !p[key] }));

  const handleViewDetails = (empresa) => {
    setDetailModal({
      open: true,
      title: `Detalles de la Empresa: ${empresa.nombre_empresa}`,
      content: (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Información de la Empresa</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography><strong>Nombre:</strong> {empresa.nombre_empresa}</Typography>
          <Typography><strong>CUIT:</strong> {empresa.cuit}</Typography>
          {empresa.datos_contacto && (
            <>
              <Typography><strong>Contacto:</strong></Typography>
              <Box sx={{ pl: 2 }}>
                <Typography><strong>Email:</strong> {empresa.datos_contacto.mail || 'No especificado'}</Typography>
                <Typography><strong>Teléfono:</strong> {empresa.datos_contacto.telefono || 'No especificado'}</Typography>
              </Box>
            </>
          )}
          {empresa.domicilio_fiscal && (
            <>
              <Typography><strong>Domicilio:</strong></Typography>
              <Box sx={{ pl: 2 }}>
                <Typography><strong>Direccion:</strong> {empresa.domicilio_fiscal.calle}</Typography>
                <Typography><strong>Ciudad:</strong> {empresa.domicilio_fiscal.ciudad}</Typography>
                <Typography><strong>Provincia:</strong> {empresa.domicilio_fiscal.provincia}</Typography>
                <Typography><strong>País:</strong> {empresa.domicilio_fiscal.pais}</Typography>
              </Box>
            </>
          )}
        </Box>
      )
    });
  };

  return (
    <Box className="formContainer">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className="formSectionTitle">Información del vehículo</Typography>
          {[{
            label: 'Patente', name: 'patente', placeholder: 'Ej: AA123BB', readOnly: isEditing
          }, {
            label: 'Marca', name: 'marca', placeholder: 'Ej: Ford, Toyota'
          }, {
            label: 'Modelo', name: 'modelo', placeholder: 'Ej: Focus, Hilux'
          }].map(({ label, name, placeholder, readOnly }) => (
            <InputField
              key={name} label={label} name={name} placeholder={placeholder} readOnly={readOnly}
              value={formData?.[name] || ''} onChange={handleChange} onBlur={handleBlur} error={errors?.[name]}
            />
          ))}

          <FieldContainer label="Tipo de Vehículo" error={errors?.tipoVehiculo}>
            <TextField
              select fullWidth size="small" name="tipoVehiculo"
              value={formData?.tipoVehiculo || ''} onChange={handleChange} onBlur={handleBlur} error={!!errors?.tipoVehiculo}
            >
              <MenuItem value="" disabled>Seleccione un tipo</MenuItem>
              {TIPOS_VEHICULO.map(tipo => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
            </TextField>
          </FieldContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className="formSectionTitle">Especificaciones</Typography>
          {[{
            label: 'Capacidad (Volumen)', name: 'volumen', type: 'number', endAdornment: <span>m³</span>
          }, {
            label: 'Capacidad (Peso)', name: 'peso', type: 'number', endAdornment: <span>kg</span>
          }, {
            label: 'Año', name: 'año', type: 'number',
            placeholder: `Ej: ${new Date().getFullYear()}`,
            inputProps: { min: 1900, max: new Date().getFullYear() + 1 }
          }].map(({ label, name, ...rest }) => (
            <InputField
              key={name} label={label} name={name}
              value={formData?.[name] || ''} onChange={handleChange} onBlur={handleBlur}
              error={errors?.[name]} {...rest}
            />
          ))}

          <FieldContainer label="Empresa" error={errors?.empresa}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth size="small"
                value={formData?.empresaNombre || inputValues.empresa || 'Sin empresa asignada'}
                InputProps={{
                  readOnly: true,
                  startAdornment: (formData?.empresaNombre || inputValues.empresa) && (
                    <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                  )
                }}
              />
              <IconButtonStyled
                onClick={() => toggleModal('empresas')}
                icon={Search}
                variant="searchButton"
              />
            </Box>
          </FieldContainer>

          <SelectionModal
            open={modalStates.empresas}
            onClose={() => toggleModal('empresas')}
            title="Seleccionar Empresa"
            items={empresas}
            onSelect={(empresa) => {
              handleChange({ target: { name: 'empresa', value: empresa._id } });
              handleChange({ target: { name: 'empresaNombre', value: empresa.nombre_empresa } });
              handleInputChange('empresa', empresa.nombre_empresa);
              toggleModal('empresas');
            }}
            searchValue={inputValues.empresa}
            onSearchChange={(val) => handleInputChange('empresa', val)}
            loading={loadingStates.empresas}
            getText={(i) => i.nombre_empresa}
            getSecondaryText={(i) => i.cuit && `CUIT: ${i.cuit}`}
            emptyText="No hay empresas disponibles"
            icon={BusinessIcon}
            onViewDetails={handleViewDetails}
          />
        </Grid>
      </Grid>

      <Modal open={detailModal.open} onClose={() => setDetailModal(p => ({ ...p, open: false }))}>
        <Paper variant="detailModal">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary">{detailModal.title}</Typography>
            <IconButton onClick={() => setDetailModal(p => ({ ...p, open: false }))}><Close /></IconButton>
          </Box>
          {detailModal.content}
        </Paper>
      </Modal>
    </Box>
  );
};

export default VehiculoForm;
