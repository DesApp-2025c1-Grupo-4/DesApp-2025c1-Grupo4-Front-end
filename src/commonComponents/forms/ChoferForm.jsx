import {
  Grid, TextField, Autocomplete, Box, Typography, IconButton,
  Modal, Button, Paper, Divider
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import {
  Search, Business, DirectionsCar, Close, Upload, Visibility
} from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import FieldContainer from '../formsComponents/FieldContainer';
import IconButtonStyled from '../formsComponents/IconButtonStyled';
import SelectionModal from '../formsComponents/SelectionModal';
import axios from 'axios';

const ChoferForm = ({ formData, handleChange, handleBlur, errors, isEditing = false }) => {
  const [empresas, setEmpresas] = useState([]);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [loadingStates, setLoadingStates] = useState({ empresas: false, vehiculos: false });
  const [modalStates, setModalStates] = useState({ empresas: false, vehiculos: false });
  const [detailModal, setDetailModal] = useState({ open: false, title: '', content: null });
  const [licenciaFile, setLicenciaFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState(formData.licenciaDocumento?.fileName || '');

  useEffect(() => {
    const doc = formData.licenciaDocumento;
    if (doc) {
      setExistingFileName(doc.fileName || '');
      if (doc.data && !doc.data.type) {
        handleChange({
          target: {
            name: 'licenciaDocumento',
            value: { ...doc, data: { type: 'Buffer', data: doc.data.data || [] } }
          }
        });
      }
    } else {
      setExistingFileName('');
    }
    if (typeof formData.licenciaExpiracion === 'string') {
      const [day, month, year] = formData.licenciaExpiracion.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date)) handleChange({ target: { name: 'licenciaExpiracion', value: date } });
    }
  }, [formData.licenciaDocumento, formData.licenciaExpiracion]);

  useEffect(() => {
    if (modalStates.empresas && empresas.length === 0) {
      setLoadingStates(p => ({ ...p, empresas: true }));
      axios.get('/api/empresas')
        .then(res => setEmpresas(res.data.filter(e => e.activo !== false)))
        .finally(() => setLoadingStates(p => ({ ...p, empresas: false })));
    }
  }, [modalStates.empresas]);

  useEffect(() => {
    if (modalStates.vehiculos) {
      setLoadingStates(p => ({ ...p, vehiculos: true }));
      const params = { activo: true };
      if (formData.empresa?._id) params.empresa = formData.empresa._id;
      axios.get('/api/vehiculos', { params })
        .then(res => {
          let data = res.data.filter(v => v.activo !== false);
          if (params.empresa) data = data.filter(v => v.empresa && (v.empresa._id === params.empresa || v.empresa === params.empresa));
          setVehiculosDisponibles(data);
        })
        .finally(() => setLoadingStates(p => ({ ...p, vehiculos: false })));
    }
  }, [modalStates.vehiculos, formData.empresa]);

  const onEmpresaSelect = (empresa) => {
    handleChange({ target: { name: 'empresa', value: { _id: empresa._id, nombre_empresa: empresa.nombre_empresa } } });
    setModalStates(p => ({ ...p, empresas: false }));
  };

  const onVehiculoSelect = (v) => {
    if (v._id === 'null') {
      handleChange({ target: { name: 'vehiculoAsignado', value: null } });
      handleChange({ target: { name: 'vehiculoAsignadoData', value: null } });
    } else {
      handleChange({ target: { name: 'vehiculoAsignado', value: v._id } });
      handleChange({ target: { name: 'vehiculoAsignadoData', value: { patente: v.patente, marca: v.marca, modelo: v.modelo } } });
    }
    setModalStates(p => ({ ...p, vehiculos: false }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setLicenciaFile(null); setExistingFileName('');
      handleChange({ target: { name: 'licenciaDocumento', value: null } });
      return;
    }
    if (file.size > 10 * 1024 * 1024) return alert('El tamaño máximo permitido es 10MB');
    const validTypes = [
      'application/pdf', 'image/jpeg', 'image/png',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!validTypes.includes(file.type)) return alert('Formato de archivo no válido. Use PDF, JPG, PNG o DOC');

    setLicenciaFile(file);
    setExistingFileName(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      handleChange({
        target: {
          name: 'licenciaDocumento',
          value: {
            data: { type: 'Buffer', data: Array.from(new Uint8Array(arrayBuffer)) },
            contentType: file.type, fileName: file.name, size: file.size
          }
        }
      });
    } catch (err) {
      console.error("Error al leer el archivo:", err);
      alert('Error al procesar el archivo');
    }
  };

  const handleViewDocument = () => {
    const doc = formData.licenciaDocumento;
    if (licenciaFile) window.open(URL.createObjectURL(licenciaFile), '_blank');
    else if (doc?.data) {
      const blob = new Blob([new Uint8Array(doc.data.data)], { type: doc.contentType });
      window.open(URL.createObjectURL(blob), '_blank');
    }
  };

  const handleViewDetails = (item) => {
    let title = '', content = null;
    const section = (label, value) => <Typography><strong>{label}:</strong> {value}</Typography>;
    const nested = (title, children) => <><Typography><strong>{title}:</strong></Typography><Box sx={{ pl: 2 }}>{children}</Box></>;

    if (item.patente) {
      title = `Detalles del Vehículo: ${item.patente}`;
      content = (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Información del Vehículo</Typography>
          <Divider sx={{ my: 1 }} />
          {section('Patente', item.patente)}
          {section('Marca', item.marca)}
          {section('Modelo', item.modelo)}
          {section('Año', item.año || item.anio)}
          {section('Tipo', item.tipo_vehiculo || item.tipo)}
          {item.capacidad_carga && nested('Capacidad',
            <>
              {section('Peso', item.capacidad_carga.peso || item.peso + ' kg')}
              {section('Volumen', item.capacidad_carga.volumen || item.volumen + ' m³')}
            </>)}
          {item.empresa?.nombre_empresa && section('Empresa', item.empresa.nombre_empresa)}
        </Box>
      );
    } else if (item.nombre_empresa) {
      title = `Detalles de la Empresa: ${item.nombre_empresa}`;
      content = (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Información de la Empresa</Typography>
          <Divider sx={{ my: 1 }} />
          {section('Nombre', item.nombre_empresa)}
          {section('CUIT', item.cuit)}
          {item.datos_contacto && nested('Contacto',
            <>
              {section('Email', item.datos_contacto.mail || 'No especificado')}
              {section('Teléfono', item.datos_contacto.telefono || 'No especificado')}
            </>)}
          {item.domicilio_fiscal && nested('Domicilio',
            <>
              {section('Dirección', item.domicilio_fiscal.calle)}
              {section('Ciudad', item.domicilio_fiscal.ciudad)}
              {section('Provincia', item.domicilio_fiscal.provincia)}
              {section('País', item.domicilio_fiscal.pais)}
            </>)}
        </Box>
      );
    }
    setDetailModal({ open: true, title, content });
  };

return (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box className="formContainer">
      <Grid container spacing={2}>
        {/** Información personal */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" className="formSectionTitle">Información personal</Typography>
          {['nombre', 'apellido', 'cuil'].map((field) => (
            <FieldContainer key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} error={errors[field]}>
              <TextField
                fullWidth size="small"
                name={field} value={formData[field] || ''}
                onChange={handleChange} onBlur={handleBlur}
                error={!!errors[field]}
                placeholder={field === 'cuil' ? 'XX-XXXXXXXX-X' : ''}
                readOnly={field === 'cuil' && isEditing}
              />
            </FieldContainer>
          ))}
          <FieldContainer label="Fecha de Nacimiento" error={errors.fechaNacimiento}>
            <DatePicker
              value={formData.fechaNacimiento instanceof Date ? formData.fechaNacimiento : null}
              onChange={(date) => handleChange({ target: { name: 'fechaNacimiento', value: date } })}
              slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.fechaNacimiento } }}
            />
          </FieldContainer>
        </Grid>

        {/** Información laboral */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" className="formSectionTitle">Información laboral</Typography>
          {[{
            label: 'Empresa',
            value: formData.empresa?.nombre_empresa || 'Sin empresa asignada',
            icon: formData.empresa && <Business sx={{ mr: 1, color: grey[600] }} />,
            onClick: () => setModalStates(p => ({ ...p, empresas: true })),
            error: errors.empresa
          }, {
            label: 'Vehículo Asignado',
            value: formData.vehiculoAsignadoData?.patente || 'Sin asignar',
            icon: formData.vehiculoAsignado && <DirectionsCar sx={{ mr: 1, color: grey[600] }} />,
            onClick: () => setModalStates(p => ({ ...p, vehiculos: true })),
            error: errors.vehiculoAsignado
          }].map(({ label, value, icon, onClick, error }) => (
            <FieldContainer key={label} label={label} error={error}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth size="small" value={value}
                  InputProps={{ readOnly: true, startAdornment: icon }}
                />
                <IconButtonStyled onClick={onClick} icon={Search} />
              </Box>
            </FieldContainer>
          ))}
        </Grid>

        {/** Licencia de conducir */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" className="formSectionTitle">Licencia de conducir</Typography>

          <FieldContainer label="Número de Licencia" error={errors.licenciaNumero}>
            <TextField
              fullWidth size="small"
              name="licenciaNumero" value={formData.licenciaNumero || ''}
              onChange={handleChange} onBlur={handleBlur} error={!!errors.licenciaNumero}
            />
          </FieldContainer>

          <FieldContainer label="Tipo de Licencia" error={errors.licenciaTipo}>
            <Autocomplete
              multiple options={['B1','B2','C1','C2','C3','D1','D2','E']}
              value={formData.licenciaTipo || []}
              onChange={(_, value) => handleChange({ target: { name: 'licenciaTipo', value } })}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </FieldContainer>

          <FieldContainer label="Fecha Expiración Licencia" error={errors.licenciaExpiracion}>
            <DatePicker
              value={formData.licenciaExpiracion instanceof Date ? formData.licenciaExpiracion : null}
              onChange={(date) => handleChange({ target: { name: 'licenciaExpiracion', value: date } })}
              slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.licenciaExpiracion } }}
            />
          </FieldContainer>

          <FieldContainer label="Documento de Licencia" error={errors.licenciaDocumento}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button variant="outlined" component="label" startIcon={<Upload />} sx={{ textTransform: 'none' }}>
                Seleccionar Archivo
                <input type="file" hidden accept="application/pdf,image/*" onChange={handleFileChange} />
              </Button>
              <Typography variant="body2" sx={{ color: grey[600] }}>
                {licenciaFile?.name || existingFileName || 'Ningún archivo seleccionado'}
              </Typography>
              {(licenciaFile || formData.licenciaDocumento) && (
                <IconButton onClick={handleViewDocument} color="primary">
                  <Visibility fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              Formatos aceptados: PDF, imágenes (max 10MB)
            </Typography>
          </FieldContainer>
        </Grid>
      </Grid>

      <SelectionModal
        open={modalStates.empresas}
        onClose={() => setModalStates(p => ({ ...p, empresas: false }))}
        title="Seleccionar Empresa"
        items={empresas} loading={loadingStates.empresas}
        onSelect={onEmpresaSelect}
        getText={(i) => i.nombre_empresa}
        getSecondaryText={(i) => i.cuit && `CUIT: ${i.cuit}`}
        emptyText="No hay empresas registradas"
        icon={Business} onViewDetails={handleViewDetails}
      />

      <SelectionModal
        open={modalStates.vehiculos}
        onClose={() => setModalStates(p => ({ ...p, vehiculos: false }))}
        title="Seleccionar Vehículo"
        items={[...(formData.empresa ? [{ _id: 'null', patente: 'Sin asignar' }] : []), ...vehiculosDisponibles]}
        loading={loadingStates.vehiculos} onSelect={onVehiculoSelect}
        getText={(i) => i.patente}
        getSecondaryText={(i) => i.marca ? `${i.marca} ${i.modelo}` : ''}
        emptyText={formData.empresa ? "No hay vehículos disponibles para esta empresa" : "No hay vehículos registrados"}
        icon={DirectionsCar} onViewDetails={handleViewDetails}
      />

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
  </LocalizationProvider>
);
}

export default ChoferForm;