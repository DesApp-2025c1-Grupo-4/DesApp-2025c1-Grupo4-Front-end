import { Grid, TextField, Autocomplete, Box, Typography, IconButton, Modal, Button, Paper, Divider } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import { Search, Business, DirectionsCar, Close } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import FieldContainer from '../formsComponents/FieldContainer';
import IconButtonStyled from '../formsComponents/IconButtonStyled';
import SelectionModal from '../formsComponents/SelectionModal';
import axios from 'axios';

const ChoferForm = ({ formData, handleChange, handleBlur, errors, isEditing = false }) => {
  // Hooks de estado
  const [empresas, setEmpresas] = useState([]);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    empresas: false,
    vehiculos: false
  });
  const [modalStates, setModalStates] = useState({
    empresas: false,
    vehiculos: false
  });
  const [detailModal, setDetailModal] = useState({
    open: false,
    title: '',
    content: null
  });

  // Efectos para cargar datos
  useEffect(() => {
    if (modalStates.empresas && empresas.length === 0) {
      setLoadingStates(prev => ({ ...prev, empresas: true }));
      axios.get('/api/empresas')
        .then(res => setEmpresas(res.data))
        .finally(() => setLoadingStates(prev => ({ ...prev, empresas: false })));
    }
  }, [modalStates.empresas]);

  useEffect(() => {
    if (modalStates.vehiculos && vehiculosDisponibles.length === 0) {
      setLoadingStates(prev => ({ ...prev, vehiculos: true }));
      axios.get('/api/vehiculos?activo=true')
        .then(res => setVehiculosDisponibles(res.data))
        .finally(() => setLoadingStates(prev => ({ ...prev, vehiculos: false })));
    }
  }, [modalStates.vehiculos]);

  // Manejadores de selección
  const onEmpresaSelect = (empresa) => {
    handleChange({ 
      target: { 
        name: "empresa", 
        value: {
          _id: empresa._id,
          nombre_empresa: empresa.nombre_empresa
        }
      } 
    });
    setModalStates(prev => ({ ...prev, empresas: false }));
  };

  const onVehiculoSelect = (vehiculo) => {
    if (vehiculo._id === 'null') {
      handleChange({ target: { name: "vehiculoAsignado", value: null } });
      handleChange({ target: { name: "vehiculoAsignadoData", value: null } });
    } else {
      handleChange({ 
        target: { 
          name: "vehiculoAsignado", 
          value: vehiculo._id
        } 
      });
      handleChange({ 
        target: { 
          name: "vehiculoAsignadoData", 
          value: {
            patente: vehiculo.patente,
            marca: vehiculo.marca,
            modelo: vehiculo.modelo
          }
        } 
      });
    }
    setModalStates(prev => ({ ...prev, vehiculos: false }));
  };

  // Manejador para mostrar detalles
  const handleViewDetails = (item) => {
    let content;
    let title;
    
    if (item.patente) {
      title = `Detalles del Vehículo: ${item.patente}`;
      content = (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Información del Vehículo</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography><strong>Patente:</strong> {item.patente}</Typography>
          <Typography><strong>Marca:</strong> {item.marca}</Typography>
          <Typography><strong>Modelo:</strong> {item.modelo}</Typography>
          <Typography><strong>Año:</strong> {item.año || item.anio}</Typography>
          <Typography><strong>Tipo:</strong> {item.tipo_vehiculo || item.tipo}</Typography>
          {item.capacidad_carga && (
            <>
              <Typography><strong>Capacidad:</strong></Typography>
              <Box sx={{ pl: 2 }}>
                <Typography><strong>Peso:</strong> {item.capacidad_carga.peso || item.peso} kg</Typography>
                <Typography><strong>Volumen:</strong> {item.capacidad_carga.volumen || item.volumen} m³</Typography>
              </Box>
            </>
          )}
          {item.empresa?.nombre_empresa && (
            <Typography><strong>Empresa:</strong> {item.empresa.nombre_empresa}</Typography>
          )}
        </Box>
      );
    } else if (item.nombre_empresa) {
      title = `Detalles de la Empresa: ${item.nombre_empresa}`;
      content = (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Información de la Empresa</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography><strong>Nombre:</strong> {item.nombre_empresa}</Typography>
          <Typography><strong>CUIT:</strong> {item.cuit}</Typography>
          {item.datos_contacto && (
            <>
              <Typography><strong>Contacto:</strong></Typography>
              <Box sx={{ pl: 2 }}>
                <Typography><strong>Email:</strong> {item.datos_contacto.mail || 'No especificado'}</Typography>
                <Typography><strong>Teléfono:</strong> {item.datos_contacto.telefono || 'No especificado'}</Typography>
              </Box>
            </>
          )}
          {item.domicilio_fiscal && (
            <>
              <Typography><strong>Domicilio:</strong></Typography>
              <Box sx={{ pl: 2 }}>
                <Typography><strong>Direccion:</strong> {item.domicilio_fiscal.calle}</Typography>
                <Typography><strong>Ciudad:</strong> {item.domicilio_fiscal.ciudad}</Typography>
                <Typography><strong>Provincia:</strong> {item.domicilio_fiscal.provincia}</Typography>
                <Typography><strong>Pais:</strong> {item.domicilio_fiscal.pais}</Typography>
              </Box>
            </>
          )}
        </Box>
      );
    }
    setDetailModal({ open: true, title, content });
  };

  // Renderizado del formulario
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="formContainer">
        <Grid container spacing={2}>
          {/* Sección de información personal */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Información personal</Typography>
            {['nombre', 'apellido', 'cuil'].map((field) => (
              <FieldContainer key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} error={errors[field]}>
                <TextField
                  fullWidth
                  size="small"
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors[field]}
                  placeholder={field === 'cuil' ? 'XX-XXXXXXXX-X' : ''}
                  readOnly={field === 'cuil' && isEditing}
                />
              </FieldContainer>
            ))}
            <FieldContainer label="Fecha de Nacimiento" error={errors.fechaNacimiento}>
              <DatePicker
                value={formData.fechaNacimiento || null}
                onChange={(date) => handleChange({ target: { name: 'fechaNacimiento', value: date } })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors.fechaNacimiento
                  }
                }}
              />
            </FieldContainer>
          </Grid>

          {/* Sección de información laboral */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Información laboral</Typography>

            <FieldContainer label="Empresa" error={errors.empresa}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.empresa?.nombre_empresa || 'Sin empresa asignada'}
                  InputProps={{
                    readOnly: true,
                    startAdornment: formData.empresa && <Business sx={{ mr: 1, color: grey[600] }} />
                  }}
                />
                <IconButtonStyled onClick={() => setModalStates(prev => ({ ...prev, empresas: true }))} icon={Search} />
              </Box>
            </FieldContainer>

            <FieldContainer label="Vehículo Asignado" error={errors.vehiculoAsignado}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.vehiculoAsignadoData?.patente || 'Sin asignar'}
                  InputProps={{
                    readOnly: true,
                    startAdornment: formData.vehiculoAsignado && <DirectionsCar sx={{ mr: 1, color: grey[600] }} />
                  }}
                />
                <IconButtonStyled onClick={() => setModalStates(prev => ({ ...prev, vehiculos: true }))} icon={Search} />
              </Box>
            </FieldContainer>

            <FieldContainer label="Número de Licencia" error={errors.licenciaNumero}>
              <TextField
                fullWidth
                size="small"
                name="licenciaNumero"
                value={formData.licenciaNumero || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.licenciaNumero}
              />
            </FieldContainer>

            <FieldContainer label="Tipo de Licencia" error={errors.licenciaTipo}>
              <Autocomplete
                multiple
                options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'C3', 'D1', 'D2', 'E']}
                value={formData.licenciaTipo || []}
                onChange={(_, value) => handleChange({ target: { name: 'licenciaTipo', value } })}
                renderInput={(params) => (
                  <TextField {...params} size="small" />
                )}
              />
            </FieldContainer>

            <FieldContainer label="Fecha Expiración Licencia" error={errors.licenciaExpiracion}>
              <DatePicker
                value={formData.licenciaExpiracion || null}
                onChange={(date) => handleChange({ target: { name: 'licenciaExpiracion', value: date } })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors.licenciaExpiracion
                  }
                }}
              />
            </FieldContainer>
          </Grid>
        </Grid>

        {/* Modales de selección */}
        <SelectionModal
          open={modalStates.empresas}
          onClose={() => setModalStates(prev => ({ ...prev, empresas: false }))}
          title="Seleccionar Empresa"
          items={empresas}
          loading={loadingStates.empresas}
          onSelect={onEmpresaSelect}
          getText={(item) => item.nombre_empresa}
          getSecondaryText={(item) => item.cuit && `CUIT: ${item.cuit}`}
          emptyText="No hay empresas registradas"
          icon={Business}
          onViewDetails={handleViewDetails}
        />

        <SelectionModal
          open={modalStates.vehiculos}
          onClose={() => setModalStates(prev => ({ ...prev, vehiculos: false }))}
          title="Seleccionar Vehículo"
          items={[{ _id: 'null', patente: 'Sin asignar' }, ...vehiculosDisponibles]}
          loading={loadingStates.vehiculos}
          onSelect={onVehiculoSelect}
          getText={(item) => item.patente}
          getSecondaryText={(item) => item.marca ? `${item.marca} ${item.modelo}` : ''}
          emptyText="No hay vehículos registrados"
          icon={DirectionsCar}
          onViewDetails={handleViewDetails}
        />

        {/* Modal de detalles */}
        <Modal
          open={detailModal.open}
          onClose={() => setDetailModal(prev => ({ ...prev, open: false }))}
        >
          <Paper sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2
          }}>
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
    </LocalizationProvider>
  );
};

export default ChoferForm;