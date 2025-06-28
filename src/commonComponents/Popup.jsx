import { useState, useEffect, useMemo } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Box, useTheme, useMediaQuery, Typography,
  Alert, CircularProgress
} from '@mui/material';
import { ROUTE_CONFIG } from '../config/routesConfig';
import validationSchemas from '../validations/validationSchemas';
import DepositoForm from './forms/DepositoForm';
import ViajeForm from './forms/ViajeForm';
import ChoferForm from './forms/ChoferForm';
import VehiculoForm from './forms/VehiculoForm';
import EmpresaForm from './forms/EmpresaForm';
import SeguimientoForm from './forms/SeguimientoForm';
import axios from 'axios';
import get from 'lodash.get';
import set from 'lodash.set';
import { format } from 'date-fns';

const convertToBackendFormat = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return '';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const initialData = {
  deposito: {
    tipo: '',
    direccion: '',
    provincia: '',
    ciudad: '',
    pais: '',
    nombreContacto: '',
    apellidoContacto: '',
    telefonoContacto: '',
    horarios: {
      dias: [],
      desde: '',
      hasta: ''
    },
    coordenadas: ''
  },
  viaje: {
    depositoOrigen: null,
    depositoDestino: null,
    fechaInicio: '',
    fechaFin: '',
    empresaTransportista: null,
    choferAsignado: null,
    vehiculoAsignado: null,
    tipoViaje: ''
  },
  chofer: {
    nombre: '',
    apellido: '',
    cuil: '',
    fechaNacimiento: '',
    empresa: '',
    vehiculoAsignado: ''
  },
  vehiculo: {
    patente: '',
    tipoVehiculo: '',
    marca: '',
    modelo: '',
    año: '',
    volumen: '',
    peso: '',
    empresa: ''
  },
  empresa: {
    nombre_empresa: '',
    cuit: '',
    datos_contacto: { mail: '', telefono: '' },
    domicilio_fiscal: { direccion: '', ciudad: '', provincia_estado: '', pais: '' }
  }
};

const Popup = ({ buttonName, page, open, onClose, children, selectedItem, onSuccess, onDelete }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const formType = useMemo(() => {
    if (page.includes('deposito')) return 'deposito';
    if (page.includes('viaje')) return 'viaje';
    if (page.includes('chofer')) return 'chofer';
    if (page.includes('vehiculo')) return 'vehiculo';
    if (page.includes('empresa')) return 'empresa';
    return 'default';
  }, [page]);

  useEffect(() => {
    if (currentOpen) {
      setFormData(selectedItem ? { ...initialData[formType], ...selectedItem } : initialData[formType]);
      setErrors({});
      setTouched({});
    }
  }, [currentOpen, selectedItem, formType]);

  const handleClose = () => {
    if (isSubmitting) return;
    setErrors({});
    setTouched({});
    if (isControlled) onClose();
    else setInternalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev };
      set(newData, name, value);
      return newData;
    });

    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validationSchemas[formType].validateAt(name, formData)
      .then(() => {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      })
      .catch(err => {
        setErrors(prev => ({ ...prev, [name]: err.message }));
      });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (page.includes('confirmar-eliminar')) {
      setIsSubmitting(true);
      try {
        if (onDelete) {
          await onDelete(selectedItem._id);
          handleClose();
        }
      } catch (error) {
        setErrors({ _general: error.message || 'Error al eliminar' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Validate all fields
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    try {
      await validationSchemas[formType].validate(formData, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);

      const endpointMap = {
        deposito: '/api/depositos',
        viaje: '/api/viajes',
        chofer: '/api/choferes',
        vehiculo: '/api/vehiculos',
        empresa: '/api/empresas'
      };

      const endpoint = endpointMap[formType];
      const method = selectedItem ? 'PUT' : 'POST';
      const url = selectedItem ? `${endpoint}/${selectedItem._id}` : endpoint;

      let dataToSend = { ...formData };

      // Transform data for specific types
      if (formType === 'viaje') {
        dataToSend = {
          deposito_origen: formData.depositoOrigen?._id || formData.depositoOrigen,
          deposito_destino: formData.depositoDestino?._id || formData.depositoDestino,
          inicio_viaje: convertToBackendFormat(formData.fechaInicio),
          fin_viaje: convertToBackendFormat(formData.fechaFin),
          empresa_asignada: formData.empresaTransportista?._id || formData.empresaTransportista,
          chofer_asignado: formData.choferAsignado?._id || formData.choferAsignado,
          vehiculo_asignado: formData.vehiculoAsignado?._id || formData.vehiculoAsignado,
          tipo_viaje: formData.tipoViaje,
          estado: 'planificado'
        };
      }

      const response = await axios({
        method,
        url,
        data: dataToSend
      });

      if (onSuccess) {
        await onSuccess(response.data);
      }
      handleClose();
    } catch (error) {
      setIsSubmitting(false);
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({
          _general: error.response?.data?.message || error.message || 'Error al procesar la solicitud'
        });
      }
    }
  };

  const renderForm = () => {
    if (page.includes('confirmar-eliminar')) {
      return (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.secondary }}>
            ¿Estás seguro que deseas eliminar este elemento?
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: theme.palette.error.main,
            fontWeight: 'bold',
            backgroundColor: theme.palette.error.light,
            p: 1,
            borderRadius: 1
          }}>
            Esta acción no se puede deshacer
          </Typography>
        </Box>
      );
    }

    if (children) return children;

    const formProps = {
      formData,
      handleChange,
      handleBlur,
      errors,
      touched,
      isEditing: !!selectedItem
    };

    switch (formType) {
      case 'deposito': return <DepositoForm {...formProps} />;
      case 'viaje': return <ViajeForm {...formProps} />;
      case 'chofer': return <ChoferForm {...formProps} />;
      case 'vehiculo': return <VehiculoForm {...formProps} />;
      case 'empresa': return <EmpresaForm {...formProps} />;
      default: return null;
    }
  };

  return (
    <>
      {!isControlled && (
        <Button
          variant="contained"
          onClick={() => setInternalOpen(true)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: theme.shadows[2],
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
            borderRadius: isMobile ? 0 : 2,
            backgroundImage: 'none',
            backgroundColor: page.includes('confirmar-eliminar') 
              ? theme.palette.error.lighter 
              : theme.palette.background.paper,
            border: page.includes('confirmar-eliminar')
              ? `1px solid ${theme.palette.error.light}`
              : `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: page.includes('confirmar-eliminar')
            ? theme.palette.error.light
            : theme.palette.primary.main,
          color: page.includes('confirmar-eliminar')
            ? theme.palette.error.contrastText
            : theme.palette.primary.contrastText,
          py: 2,
          px: 3,
          fontSize: '1.25rem',
          fontWeight: 600
        }}>
          {page.includes('confirmar-eliminar') 
            ? 'Confirmar eliminación' 
            : (selectedItem ? 'Editar' : 'Nuevo') + ' ' + buttonName}
        </DialogTitle>
        
        <DialogContent sx={{
          py: 3,
          px: 3,
          '&.MuiDialogContent-root': {
            paddingTop: '24px !important'
          }
        }}>
          {errors._general && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 1,
                border: `1px solid ${theme.palette.error.light}`
              }}
            >
              {errors._general}
            </Alert>
          )}
          {renderForm()}
        </DialogContent>

        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.grey[50]
        }}>
          <Button 
            onClick={handleClose} 
            disabled={isSubmitting}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 1,
              border: `1px solid ${theme.palette.grey[400]}`,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.grey[200]
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            color={page.includes('confirmar-eliminar') ? 'error' : 'primary'}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '0.9375rem',
              fontWeight: 600,
              minWidth: 100,
              '&.Mui-disabled': {
                backgroundColor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled
              }
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: 'inherit' }} />
            ) : page.includes('confirmar-eliminar') ? (
              'Eliminar'
            ) : (
              selectedItem ? 'Guardar' : 'Crear'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Popup;