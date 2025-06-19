import { useState, useEffect, useMemo } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Box, useTheme, useMediaQuery, Typography
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

  const formType = useMemo(() => {
    if (page.includes('deposito')) return 'deposito';
    if (page.includes('viaje')) return 'viaje';
    if (page.includes('chofer')) return 'chofer';
    if (page.includes('vehiculo')) return 'vehiculo';
    return 'default';
  }, [page]);

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
          newFormData.depositoOrigen = selectedItem?.depositoOrigen || null;
          newFormData.depositoDestino = selectedItem?.depositoDestino || null;
          newFormData.fechaInicio = selectedItem?.fechaInicio || '';
          newFormData.fechaFin = selectedItem?.fechaFin || '';
          newFormData.empresaTransportista = selectedItem?.empresaTransportista || null;
          newFormData.choferAsignado = selectedItem?.choferAsignado || null;
          newFormData.vehiculoAsignado = selectedItem?.vehiculoAsignado || null;
          newFormData.tipoViaje = selectedItem?.tipoViaje || '';
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
        <Box textAlign="center" sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ 
            mb: 3,
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: 'text.secondary'
          }}>
            ¿Estás seguro que deseas eliminar este elemento?
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: theme.palette.error.main,
            fontWeight: 600,
            fontSize: isMobile ? '1rem' : '1.1rem'
          }}>
            Esta acción no se puede deshacer.
          </Typography>
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
            fontWeight: 600,
            letterSpacing: 0.5,
            py: 1.5,
            fontSize: '0.875rem',
            textTransform: 'none',
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
              backgroundColor: theme.palette.primary.dark
            },
            transition: 'all 0.3s ease'
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
              ? 'rgba(255, 235, 235, 0.97)' 
              : 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(12px)',
            borderRadius: isMobile ? 0 : '16px',
            p: isMobile ? 1 : 3,
            boxShadow: theme.shadows[10],
            minHeight: isMobile ? '100vh' : 'auto',
            border: page.includes('confirmar-eliminar') 
              ? `1px solid ${theme.palette.error.light}`
              : `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          backgroundColor: 'transparent',
          borderRadius: isMobile ? 0 : '12px',
          pb: 2,
          pt: isMobile ? 1 : 0
        }}>
          {!page.includes('confirmar-eliminar') && ROUTE_CONFIG[`/${page}`]?.logo && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mb: 2,
              pt: 2
            }}>
              <Box sx={{
                p: 2,
                borderRadius: '50%',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {ROUTE_CONFIG[`/${page}`]?.logo}
              </Box>
            </Box>
          )}
          
          <DialogTitle sx={{ 
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: 700,
            color: page.includes('confirmar-eliminar') 
              ? theme.palette.error.main 
              : theme.palette.primary.main,
            textAlign: 'center',
            px: isMobile ? 1 : 3,
            pt: isMobile ? 1 : 2,
            pb: 1,
            letterSpacing: '0.5px'
          }}>
            {page.includes('confirmar-eliminar') 
              ? 'Confirmar eliminación' 
              : ROUTE_CONFIG[`/${page}`]?.newButton || buttonName}
          </DialogTitle>
          
          <Box sx={{ 
            backgroundColor: page.includes('confirmar-eliminar') 
              ? 'rgba(255, 235, 235, 0.3)' 
              : 'rgba(245, 245, 245, 0.5)',
            borderRadius: '12px',
            p: isMobile ? 2 : 3,
            mx: isMobile ? 0 : 1,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[1]
          }}>
            <DialogContent sx={{ 
              py: 1,
              px: isMobile ? 0 : 2,
              '&.MuiDialogContent-root': {
                paddingTop: '16px'
              }
            }}>
              {renderForm()}
            </DialogContent>
            
            <DialogActions sx={{ 
              px: isMobile ? 0 : 2,
              py: 2,
              justifyContent: 'center',
              gap: 2
            }}>
              <Button 
                onClick={handleClose} 
                variant="outlined"
                sx={{ 
                  minWidth: 120,
                  py: 1.5,
                  borderRadius: '8px',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px'
                  }
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
                  minWidth: 120,
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: theme.shadows[2]
                  }
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