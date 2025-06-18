import { useState, useEffect, useMemo } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Box, useTheme, useMediaQuery
} from '@mui/material';
import { ROUTE_CONFIG } from '../config/routesConfig';
import validationSchemas from '../validations/validationSchemas';
import DepositoForm from './forms/DepositoForm';
import ViajeForm from './forms/ViajeForm';
import ChoferForm from './forms/ChoferForm';
import VehiculoForm from './forms/VehiculoForm';
import EmpresaForm from './forms/EmpresaForm';
import SeguimientoForm from './forms/SeguimientoForm';

const initialData = {
  deposito: {
    tipo: '', horarios: '', calle: '', numero: '', provincia: '', pais: '', coordenadas: '',
    nombreContacto: '', apellidoContacto: '', dniContacto: '', telefonoContacto: '', razonSocial: '', cuit: ''
  },
  viaje: {
    idViaje: '', depositoOrigen: '', depositoDestino: '', fechaHoraInicio: '', fechaHoraFin: '', 
    empresa: '', chofer: '', vehiculo: '', tipoViaje: '', estado: ''
  },
  chofer: {
    nombre: '', apellido: '', cuil: '', fechaNacimiento: '', empresa: '', vehiculoAsignado: ''
  },
  vehiculo: {
    patente: '', tipoVehiculo: '', marca: '', modelo: '', año: '', volumen: '', peso: '', empresa: ''
  },
  default: {
    razonSocial: '', cuit: '', domicilio: '', telefono: ''
  }
};

const Popup = ({ buttonName, page, open, onClose, children, selectedItem }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData.default);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  // Determinar el tipo de formulario
  const formType = useMemo(() => {
    if (page.includes('deposito')) return 'deposito';
    if (page.includes('viaje')) return 'viaje';
    if (page.includes('chofer')) return 'chofer';
    if (page.includes('vehiculo')) return 'vehiculo';
    return 'default';
  }, [page]);

  // Efecto para actualizar formData cuando selectedItem cambia o se abre el popup
  useEffect(() => {
    if (currentOpen) {
      const newFormData = { ...initialData[formType] };
      
      if (selectedItem) {
        if (formType === 'deposito') {
          newFormData.tipo = selectedItem?.tipo || '';
          newFormData.horarios = selectedItem?.horarios || '';
          newFormData.calle = selectedItem?.localizacion?.calle || '';
          newFormData.numero = selectedItem?.localizacion?.número || '';
          newFormData.provincia = selectedItem?.localizacion?.provincia || '';
          newFormData.pais = selectedItem?.localizacion?.pais || '';
          newFormData.coordenadas = selectedItem?.localizacion?.coordenadas || '';
          newFormData.nombreContacto = selectedItem?.contacto?.nombre || '';
          newFormData.apellidoContacto = selectedItem?.contacto?.apellido || '';
          newFormData.telefonoContacto = selectedItem?.contacto?.telefono || '';
          newFormData.razonSocial = selectedItem?.razonSocial || '';
          newFormData.cuit = selectedItem?.cuit || '';
        } 
        else if (formType === 'viaje') {
          newFormData.idViaje = selectedItem?._id || '';
          newFormData.depositoOrigen = selectedItem?.origen || '';
          newFormData.depositoDestino = selectedItem?.destino || '';
          newFormData.fechaHoraInicio = selectedItem?.fechaInicio || '';
          newFormData.fechaHoraFin = selectedItem?.fechaFin || '';
          newFormData.empresa = selectedItem?.empresaTransportista || '';
          newFormData.chofer = selectedItem?.nombreChofer || '';
          newFormData.vehiculo = selectedItem?.patenteVehiculo || '';
          newFormData.tipoViaje = selectedItem?.tipoViaje || '';
          newFormData.estado = selectedItem?.estado || '';
        }
        else if (formType === 'chofer') {
          newFormData.nombre = selectedItem?.nombre || '';
          newFormData.apellido = selectedItem?.apellido || '';
          newFormData.cuil = selectedItem?.cuil || '';
          newFormData.fechaNacimiento = selectedItem?.fechaNacimiento || '';
          newFormData.empresa = selectedItem?.empresa || '';
          newFormData.vehiculoAsignado = selectedItem?.vehiculoAsignado || '';
        }
        else if (formType === 'vehiculo') {
          newFormData.patente = selectedItem?.patente || '';
          newFormData.tipoVehiculo = selectedItem?.tipo_vehiculo || selectedItem?.tipo || ''; 
          newFormData.marca = selectedItem?.marca || '';
          newFormData.modelo = selectedItem?.modelo || '';
          newFormData.año = selectedItem?.año || selectedItem?.anio || ''; 
          newFormData.volumen = selectedItem?.volumen || '';
          newFormData.peso = selectedItem?.peso || '';
          newFormData.empresa = selectedItem?.empresa || '';
        }
        else {
          newFormData.nombre_empresa = selectedItem?.nombre_empresa || '';
          newFormData.cuit = selectedItem?.cuit || '';
          newFormData.datos_contacto = {
            mail: selectedItem?.datos_contacto?.mail || '',
            telefono: selectedItem?.datos_contacto?.telefono || ''
          };
          newFormData.domicilio_fiscal = {
            calle: selectedItem?.domicilio_fiscal?.calle || '',
            numero: selectedItem?.domicilio_fiscal?.numero || '',
            ciudad: selectedItem?.domicilio_fiscal?.ciudad || '',
            provincia: selectedItem?.domicilio_fiscal?.provincia || ''
          };
        }
      }

      setFormData(newFormData);
      setErrors({});
      setTouched({});
    }
  }, [currentOpen, selectedItem, formType]);

  const handleClose = () => {
    setErrors({});
    setTouched({});
    
    if (isControlled) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validationSchemas[formType].validateAt(name, { [name]: value })
        .then(() => setErrors(prev => ({ ...prev, [name]: '' })))
        .catch(err => setErrors(prev => ({ ...prev, [name]: err.message })));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validationSchemas[formType].validateAt(name, formData)
      .then(() => setErrors(prev => ({ ...prev, [name]: '' })))
      .catch(error => setErrors(prev => ({ ...prev, [name]: error.message })));
  };

  const handleSubmit = async () => {
    if (page.includes('confirmar-eliminar')) {
      console.log('Eliminando elemento:', selectedItem);
      handleClose();
      return;
    }

    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    
    try {
      await validationSchemas[formType].validate(formData, { abortEarly: false });
      setErrors({});
      console.log('Submit:', formData);
      handleClose();
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(err => newErrors[err.path] = err.message);
      setErrors(newErrors);
    }
  };

  const renderForm = () => {
    if (page.includes('confirmar-eliminar')) {
      return (
        <Box textAlign="center">
          <p style={{ marginBottom: '16px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            ¿Estás seguro que deseas eliminar este elemento?
          </p>
          <p style={{ color: theme.palette.error.main, fontWeight: 500 }}>
            Esta acción no se puede deshacer.
          </p>
        </Box>
      );
    }
    
    if (children) return children;
    
    const formProps = { formData, handleChange, handleBlur, errors };
    
    switch (formType) {
      case 'deposito': return <DepositoForm {...formProps} />;
      case 'viaje': return <ViajeForm {...formProps} />;
      case 'chofer': return <ChoferForm {...formProps} />;
      case 'vehiculo': return <VehiculoForm {...formProps} />;
      case 'seguimiento': return <SeguimientoForm formData={formData} />;
      default: return <EmpresaForm {...formProps} />;
    }
  };

  return (
    <>
      {!isControlled && (
        <Button 
          fullWidth 
          variant="contained" 
          onClick={() => setInternalOpen(true)}
          sx={{
            fontWeight: 500,
            letterSpacing: 0.5,
            py: 1.5
          }}
        >
          {buttonName}
        </Button>
      )}

      <Dialog 
        open={currentOpen} 
        onClose={handleClose} 
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            backgroundColor: page.includes('confirmar-eliminar') 
              ? 'rgba(255, 235, 235, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: isMobile ? 0 : '12px',
            p: isMobile ? 1 : 2,
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
            minHeight: isMobile ? '100vh' : 'auto',
            border: page.includes('confirmar-eliminar') 
              ? `1px solid ${theme.palette.error.light}`
              : `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <Box sx={{ 
          backgroundColor: 'transparent',
          borderRadius: isMobile ? 0 : '8px',
          pb: 2,
          pt: isMobile ? 1 : 0
        }}>
          {!page.includes('confirmar-eliminar') && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mb: 2
            }}>
              {ROUTE_CONFIG[`/${page}`]?.logo}
            </Box>
          )}
          
          <DialogTitle sx={{ 
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            fontWeight: 600,
            color: page.includes('confirmar-eliminar') ? 'error.main' : 'text.primary',
            textAlign: 'center',
            px: isMobile ? 1 : 3,
            pt: isMobile ? 1 : 2,
            pb: 1
          }}>
            {page.includes('confirmar-eliminar') 
              ? 'Confirmar eliminación' 
              : ROUTE_CONFIG[`/${page}`]?.newButton || buttonName}
          </DialogTitle>
          
          <Box sx={{ 
            backgroundColor: page.includes('confirmar-eliminar') 
              ? 'rgba(255, 235, 235, 0.3)' 
              : 'rgba(245, 245, 245, 0.5)',
            borderRadius: '8px',
            p: isMobile ? 2 : 3,
            mx: isMobile ? 0 : 1
          }}>
            <DialogContent sx={{ 
              py: 1,
              px: isMobile ? 0 : 2
            }}>
              {renderForm()}
            </DialogContent>
            
            <DialogActions sx={{ 
              px: isMobile ? 0 : 2,
              py: 2,
              justifyContent: 'center'
            }}>
              <Button 
                onClick={handleClose} 
                variant="outlined"
                sx={{ 
                  mr: 2,
                  minWidth: 100
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                color={page.includes('confirmar-eliminar') ? 'error' : 'primary'}
                variant="contained"
                disabled={Object.values(errors).some(Boolean) && !page.includes('confirmar-eliminar')}
                sx={{
                  minWidth: 100,
                  fontWeight: 500
                }}
              >
                {page.includes('confirmar-eliminar') ? 'Eliminar' : 'Guardar'}
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Popup;