import {Grid,TextField,Box,Typography,MenuItem,IconButton,Paper,Divider,Modal,} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BusinessIcon from '@mui/icons-material/Business';
import Close from '@mui/icons-material/Close';
import FieldContainer from '../formsComponents/FieldContainer';
import IconButtonStyled from '../formsComponents/IconButtonStyled';
import SelectionModal from '../formsComponents/SelectionModal';
import Search from '@mui/icons-material/Search';
import useDebouncedFetch from '../../hooks/useDebouncedFetch'; 

// Constantes
const TIPOS_VEHICULO = [
  // Vehículos ligeros
  'Moto','Auto','Camioneta','Furgoneta Pequeña','Van',
  // Vehículos medianos (distribución urbana/regional)
  'Furgón','Camión','Camión con Plataforma','Vehículo Multidrop',
  // Vehículos pesados (larga distancia/cargas especiales)
  'Tráiler/Tractocamión','Semirremolque','Volquete','Cisterna','Refrigerado','Portacontenedores',
  // Otros (especializados)
  'Lowboy (Maquinaria Pesada)','Jaula (Ganado)','Grúa','Vehículo Blindado'
];

// Componente InputField reutilizable
const InputField = ({ label, name, value, onChange, onBlur, error, placeholder, type = 'text', helperText, readOnly = false, inputProps, endAdornment }) => (
  <FieldContainer label={label} error={error}>
    <TextField
      fullWidth
      size="small"
      name={name}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      placeholder={placeholder}
      type={type}
      helperText={helperText}
      InputProps={{ readOnly, endAdornment, inputProps }}
    />
  </FieldContainer>
);

// Componente principal del formulario
const VehiculoForm = ({ formData, handleChange, handleBlur, errors, isEditing = false }) => {
  // Hooks de estado
  const [empresas, setEmpresas] = useState([]);
  const [inputValues, setInputValues] = useState({ 
    empresa: formData?.empresaNombre || ''
  });
  const [loadingStates, setLoadingStates] = useState({ empresas: false });
  const [modalStates, setModalStates] = useState({ empresas: false });
  const [detailModal, setDetailModal] = useState({
    open: false,
    title: '',
    content: null
  });

  // Efectos
  useEffect(() => {
    if (isEditing && formData?.empresa) {
      setInputValues(prev => ({ ...prev, empresa: formData.empresa.nombre_empresa }));
    }
  }, [isEditing, formData?.empresa]);

  useDebouncedFetch('/api/empresas', 'nombre', inputValues.empresa, setEmpresas, (loading) => setLoadingStates(prev => ({ ...prev, empresas: loading })));

  // Controladores
  const handleInputChange = (key, value) => setInputValues(prev => ({ ...prev, [key]: value }));
  const toggleModal = (key) => setModalStates(prev => ({ ...prev, [key]: !prev[key] }));

  // Manejador para ver detalles de empresa
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
                <Typography><strong>Pais:</strong> {empresa.domicilio_fiscal.pais}</Typography>
              </Box>
            </>
          )}
        </Box>
      )
    });
  };

  // Renderizado del formulario
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Sección: Información del vehículo */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className="formSectionTitle">Información del vehículo</Typography>
          <InputField 
            label="Patente" 
            name="patente" 
            value={formData?.patente || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors?.patente} 
            placeholder="Ej: AA123BB" 
            readOnly={isEditing} 
          />
          
          <FieldContainer label="Tipo de Vehículo" error={errors?.tipoVehiculo}>
            <TextField 
              select 
              fullWidth 
              size="small" 
              name="tipoVehiculo" 
              value={formData?.tipoVehiculo || ''} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              error={!!errors?.tipoVehiculo}
            >
              <MenuItem value="" disabled>Seleccione un tipo</MenuItem>
              {TIPOS_VEHICULO.map((tipo) => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
            </TextField>
          </FieldContainer>

          <InputField label="Marca" name="marca" value={formData?.marca || ''} onChange={handleChange} onBlur={handleBlur} error={errors?.marca} placeholder="Ej: Ford, Toyota" />
          <InputField label="Modelo" name="modelo" value={formData?.modelo || ''} onChange={handleChange} onBlur={handleBlur} error={errors?.modelo} placeholder="Ej: Focus, Hilux" />
        </Grid>

        {/* Sección: Especificaciones */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className="formSectionTitle">Especificaciones</Typography>
          <InputField label="Capacidad (Volumen)" name="volumen" value={formData?.volumen || ''} onChange={handleChange} onBlur={handleBlur} error={errors?.volumen} type="number" endAdornment={<span>m³</span>} />
          <InputField label="Capacidad (Peso)" name="peso" value={formData?.peso || ''} onChange={handleChange} onBlur={handleBlur} error={errors?.peso} type="number" endAdornment={<span>kg</span>} />
          <InputField 
            label="Año" 
            name="año" 
            value={formData?.año || ''} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            error={errors?.año} 
            type="number" 
            placeholder={`Ej: ${new Date().getFullYear()}`} 
            inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }} 
          />

          {/* Campo de empresa con modal de selección */}
          <FieldContainer label="Empresa" error={errors?.empresa}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={formData?.empresaNombre || inputValues.empresa || 'Sin empresa asignada'}
                InputProps={{
                  readOnly: true,
                  startAdornment: (formData?.empresaNombre || inputValues.empresa) && (
                    <BusinessIcon sx={{ mr: 1, color: grey[600] }} />
                  )
                }}
              />
              <IconButtonStyled 
                onClick={() => toggleModal('empresas')} 
                icon={Search} 
              />
            </Box>
          </FieldContainer>

          {/* Modal de selección de empresa */}
          <SelectionModal
            open={modalStates.empresas}
            onClose={() => toggleModal('empresas')}
            title="Seleccionar Empresa"
            items={empresas}
            onSelect={(empresa) => {
              handleChange({ 
                target: { 
                  name: 'empresa', 
                  value: empresa._id
                }
              });
              handleChange({
                target: {
                  name: 'empresaNombre',
                  value: empresa.nombre_empresa
                }
              });
              handleInputChange('empresa', empresa.nombre_empresa);
              toggleModal('empresas'); 
            }}  
            searchValue={inputValues.empresa}
            onSearchChange={(val) => handleInputChange('empresa', val)}
            loading={loadingStates.empresas}
            getText={(item) => item.nombre_empresa}
            getSecondaryText={(item) => item.cuit && `CUIT: ${item.cuit}`}
            emptyText="No hay empresas disponibles"
            icon={BusinessIcon}
            onViewDetails={handleViewDetails}
          />
        </Grid>
      </Grid>

      {/* Modal de detalles */}
      <Modal
        open={detailModal.open}
        onClose={() => setDetailModal(prev => ({ ...prev, open: false }))}
      >
        <Paper variant="detailModal">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary">{detailModal.title}</Typography>
            <IconButton onClick={() => setDetailModal(prev => ({ ...prev, open: false }))}>
              <Close />
            </IconButton>
          </Box>
          {detailModal.content}
        </Paper>
      </Modal>
    </Box>
  );
};

export default VehiculoForm;