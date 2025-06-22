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
import axios from 'axios';

const initialData = {
  deposito: {
    tipo: '',
    razonSocial: '',
    cuit: '',
    calle: '',
    numero: '',
    provincia: '',
    pais: '',
    nombreContacto: '',
    apellidoContacto: '',
    telefonoContacto: '',
    horarios: '',
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
    domicilio_fiscal: { calle: '', numero: '', ciudad: '', provincia: '', pais: '' }
  }
};

const Popup = ({ buttonName, page, open, onClose, children, selectedItem, onSuccess }) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Inicializar con el formType correcto para evitar "undefined"
  const formType = useMemo(() => {
    if (page.includes('deposito')) return 'deposito';
    if (page.includes('viaje')) return 'viaje';
    if (page.includes('chofer')) return 'chofer';
    if (page.includes('vehiculo')) return 'vehiculo';
    if (page.includes('empresa')) return 'empresa';
    return 'default';
  }, [page]);

  // Inicializar formData con el formType actual
  const [formData, setFormData] = useState(initialData[formType] || {});

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  // Cada vez que cambia la apertura o selectedItem, inicializamos datos
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
          newFormData.depositoOrigen = selectedItem?.depositoOrigen?._id || selectedItem?.depositoOrigen || null;
          newFormData.depositoDestino = selectedItem?.depositoDestino?._id || selectedItem?.depositoDestino || null;
          newFormData.fechaInicio = selectedItem?.fechaInicio || '';
          newFormData.fechaFin = selectedItem?.fechaFin || '';
          newFormData.empresaTransportista = selectedItem?.empresaTransportista?._id || selectedItem?.empresaTransportista || null;
          newFormData.choferAsignado = selectedItem?.choferAsignado?._id || selectedItem?.choferAsignado || null;
          newFormData.vehiculoAsignado = selectedItem?.vehiculoAsignado?._id || selectedItem?.vehiculoAsignado || null;
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
          newFormData._id = selectedItem?._id || '';
          newFormData.patente = selectedItem?.patente || '';
          newFormData.tipoVehiculo = selectedItem?.tipo_vehiculo || selectedItem?.tipo || '';
          newFormData.marca = selectedItem?.marca || '';
          newFormData.modelo = selectedItem?.modelo || '';
          newFormData.año = selectedItem?.año || selectedItem?.anio || '';
          newFormData.volumen = selectedItem?.capacidad_carga?.volumen || selectedItem?.volumen || '';
          newFormData.peso = selectedItem?.capacidad_carga?.peso || selectedItem?.peso || '';
          newFormData.empresa = selectedItem?.empresa?._id || '';
        }
        else if (formType === 'empresa') {
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
            provincia: selectedItem?.domicilio_fiscal?.provincia || '',
            pais: selectedItem?.domicilio_fiscal?.pais || ''
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
    setIsSubmitting(false);
    if (isControlled) onClose();
    else setInternalOpen(false);
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
      // Aquí ajustamos para que los campos que deben ser objetos con _id tengan esa forma
      let formDataToValidate = { ...formData };

      if (formType === 'viaje') {
        ['depositoOrigen', 'depositoDestino', 'empresaTransportista', 'choferAsignado', 'vehiculoAsignado'].forEach(field => {
          const val = formDataToValidate[field];
          if (val && typeof val === 'string') {
            formDataToValidate[field] = { _id: val };
          } else if (!val) {
            formDataToValidate[field] = null;
          }
        });
      }

      await validationSchemas[formType].validate(formDataToValidate, { abortEarly: false });
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
      const url = selectedItem && formData._id ? `${endpoint}/${formData._id}` : endpoint;

      let dataToSend = { ...formData };

      if (formType === 'deposito') {
        dataToSend = {
          tipo: formData.tipo,
          activo: true,
          localizacion: {
            direccion: `${formData.calle} ${formData.numero}`,
            provincia_estado: formData.provincia,
            ciudad: formData.provincia,
            pais: formData.pais
          },
          personal_contacto: {
            nombre: formData.nombreContacto,
            apellido: formData.apellidoContacto,
            telefono: formData.telefonoContacto
          },
          horarios: {
            dias: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
            desde: '08:00',
            hasta: '17:00'
          }
        };
      } else if (formType === 'vehiculo') {
        dataToSend = {
          patente: formData.patente,
          tipo_vehiculo: formData.tipoVehiculo,
          marca: formData.marca,
          modelo: formData.modelo,
          anio: formData.año,
          capacidad_carga: { 
            volumen: formData.volumen,
            peso: formData.peso
          },
          empresa: {
            _id: formData.empresa 
          },
          activo: true 
        };
      } else if (formType === 'chofer') {
        dataToSend = {
          ...dataToSend,
          empresa: dataToSend.empresa?._id || dataToSend.empresa,
          vehiculoAsignado: dataToSend.vehiculoAsignado?._id || dataToSend.vehiculoAsignado
        };
      } else if (formType === 'vehiculo') {
        dataToSend = {
          ...dataToSend,
          empresa: typeof dataToSend.empresa === 'object' 
            ? dataToSend.empresa._id || '' 
            : dataToSend.empresa || ''
        };
      } else if (formType === 'empresa') {
        dataToSend = {
          nombre_empresa: formData.nombre_empresa,
          cuit: formData.cuit,
          domicilio_fiscal: {
            calle: formData.domicilio_fiscal.calle,
            numero: formData.domicilio_fiscal.numero,
            ciudad: formData.domicilio_fiscal.ciudad,
            provincia: formData.domicilio_fiscal.provincia,
            pais: formData.domicilio_fiscal.pais,
          },
          datos_contacto: {
            telefono: String(formData.datos_contacto.telefono),
            mail: formData.datos_contacto.mail
          }
        };
      }

      console.log('Payload enviado:', JSON.stringify(dataToSend, null, 2));

      const response = await axios({
        method,
        url: selectedItem ? `${endpoint}/${selectedItem._id}` : endpoint,
        data: dataToSend
      });

      console.log('Registro creado/actualizado:', response.data);
      if (onSuccess) onSuccess(response.data);
      handleClose();
      window.location.reload();

    } catch (error) {
      console.error('Error al enviar datos:', error);
      setIsSubmitting(false);

      if (error.response) {
        const backendErrors = error.response.data.errors || {};
        const formattedErrors = {};
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key] = backendErrors[key].message;
        });
        setErrors(formattedErrors);
      } else if (error.inner) {
        const newErrors = {};
        error.inner.forEach(err => newErrors[err.path] = err.message);
        setErrors(newErrors);
      } else {
        setErrors({ _general: 'Error de conexión con el servidor' });
      }
    }
  };

  const renderForm = () => {
    if (page.includes('confirmar-eliminar')) {
      return (
        <Box textAlign="center" sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ mb: 3, fontSize: isMobile ? '1rem' : '1.1rem', color: 'text.secondary' }}>
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

    const formProps = {
      formData,
      handleChange,
      handleBlur,
      errors,
      isEditing: !!selectedItem
    };

    switch (formType) {
      case 'deposito': return <DepositoForm {...formProps} />;
      case 'viaje': return <ViajeForm {...formProps} />;
      case 'chofer': return <ChoferForm {...formProps} />;
      case 'vehiculo': return <VehiculoForm {...formProps} />;
      case 'seguimiento': return <SeguimientoForm formData={formData} />;
      case 'empresa':
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
                disabled={isSubmitting || (Object.values(errors).some(Boolean) && !page.includes('confirmar-eliminar'))}
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
                {isSubmitting ? 'Guardando...' : (page.includes('confirmar-eliminar') ? 'Eliminar' : 'Guardar')}
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Popup;
