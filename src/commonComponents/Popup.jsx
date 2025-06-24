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
    domicilio_fiscal: { calle: '', numero: '', ciudad: '', provincia: '', pais: '' }
  }
};

const Popup = ({ buttonName, page, open, onClose, children, selectedItem, onSuccess }) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Detectar tipo de formulario según page
  const formType = useMemo(() => {
    if (page.includes('deposito')) return 'deposito';
    if (page.includes('viaje')) return 'viaje';
    if (page.includes('chofer')) return 'chofer';
    if (page.includes('vehiculo')) return 'vehiculo';
    if (page.includes('empresa')) return 'empresa';
    return 'default';
  }, [page]);

  // Estado del formulario inicializado según tipo
  const [formData, setFormData] = useState(initialData[formType] || {});

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  useEffect(() => {
    if (currentOpen) {
      const newFormData = { ...initialData[formType] };

      if (selectedItem) {
        if (formType === 'deposito') {
          newFormData.tipo = selectedItem?.tipo || '';
          // Asegurar que horarios sea objeto y no string
          newFormData.horarios = selectedItem?.horarios || { dias: [], desde: '', hasta: '' };
          newFormData.direccion = selectedItem?.localizacion?.direccion || '';
          newFormData.provincia = selectedItem?.localizacion?.provincia_estado || '';
          newFormData.ciudad = selectedItem?.localizacion?.ciudad || '';
          newFormData.pais = selectedItem?.localizacion?.pais || '';
          newFormData.coordenadas = selectedItem?.localizacion?.coordenadas || '';
          newFormData.nombreContacto = selectedItem?.personal_contacto?.nombre || '';   
          newFormData.apellidoContacto = selectedItem?.personal_contacto?.apellido || ''; 
          newFormData.telefonoContacto = selectedItem?.personal_contacto?.telefono || ''; 
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
          newFormData._id = selectedItem?._id || '';
          newFormData.nombre = selectedItem?.nombre || '';
          newFormData.apellido = selectedItem?.apellido || '';
          newFormData.cuil = selectedItem?.cuil || '';
          newFormData.fechaNacimiento = selectedItem?.fechaNacimiento || null;
          newFormData.empresa = selectedItem?.empresa || null;
          newFormData.vehiculoAsignado = selectedItem?.vehiculoAsignado || null;
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

  setFormData(prev => {
    const newFormData = { ...prev };
    set(newFormData, name, value);
    return newFormData;
  });
  if (errors[name] || errors[name.split('.')[0]]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        if (newErrors[parent]?.[child]) {
          delete newErrors[parent][child];
          if (Object.keys(newErrors[parent]).length === 0) {
            delete newErrors[parent];
          }
        }
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
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
          localizacion: {
            direccion: formData.direccion,
            provincia_estado: formData.provincia, 
            ciudad: formData.ciudad,
            pais: formData.pais
          },
          tipo: formData.tipo,
          activo: true, 
          personal_contacto: {
            nombre: formData.nombreContacto,
            apellido: formData.apellidoContacto,
            telefono: formData.telefonoContacto
          },
          horarios: {
            dias: formData.horarios?.dias || [],
            desde: formData.horarios?.desde || '',
            hasta: formData.horarios?.hasta || ''
          }
        };
      } if (formType === 'vehiculo') {
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
            empresa: typeof formData.empresa === 'object' ? formData.empresa._id : formData.empresa, // Solo el ID
            activo: true
          };
        } else if (formType === 'chofer') {
          dataToSend = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            cuil: formData.cuil,
            fecha_nacimiento: formData.fechaNacimiento,
            empresa: formData.empresa, // Solo el ID
            vehiculo_defecto: formData.vehiculoAsignado || null,
            activo: true,
            licencia: {
              numero: formData.licenciaNumero || "00000000", // Valor temporal requerido
              tipos: formData.licenciaTipos || ["C2"], // Valor temporal requerido
              fecha_expiracion: formData.licenciaExpiracion 
                ? format(new Date(formData.licenciaExpiracion), 'dd/MM/yyyy')
                : format(new Date(), 'dd/MM/yyyy'), // Valor por defecto
              documento: {
                data: "", // Campo obligatorio - valor temporal
                contentType: "application/pdf", // Valor temporal
                fileName: "licencia.pdf", // Valor temporal
                size: 0 // Valor temporal
              }
            }
          };
        }   else if (formType === 'viaje') {
              dataToSend = {
                deposito_origen: formData.depositoOrigen._id || formData.depositoOrigen,
                deposito_destino: formData.depositoDestino._id || formData.depositoDestino,
                inicio_viaje: convertToBackendFormat(formData.fechaInicio),
                fin_viaje: convertToBackendFormat(formData.fechaFin),
                empresa_asignada:
                  formData.empresaTransportista && typeof formData.empresaTransportista === 'object'
                    ? formData.empresaTransportista._id
                    : formData.empresaTransportista || null,
                chofer_asignado: formData.choferAsignado._id || formData.choferAsignado,
                vehiculo_asignado: formData.vehiculoAsignado._id || formData.vehiculoAsignado,
                estado: 'planificado'
              };
            } else if (formType === 'empresa') {
                dataToSend = {
                  nombre_empresa: formData.nombre_empresa,
                  cuit: formData.cuit,
                  domicilio_fiscal: {
                    calle: formData.domicilio_fiscal.calle,
                    ciudad: formData.domicilio_fiscal.ciudad,
                    provincia: formData.domicilio_fiscal.provincia,
                    pais: formData.domicilio_fiscal.pais,
                  },
                  datos_contacto: {
                    telefono: String(formData.datos_contacto.telefono),
                    mail: formData.datos_contacto.mail
                  },
                  activo: true
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
  setIsSubmitting(false);
  
  if (error.response) {
    const backendError = error.response.data;
    let formattedErrors = {};
    
    // Manejar error específico de horarios
    if (backendError.message?.includes('hora de cierre')) {
      formattedErrors = {
        ...formattedErrors,
        horarios: {
          hasta: backendError.message
        }
      };
    } else if (backendError.errors) {
      // Mapear otros errores de validación
      Object.entries(backendError.errors).forEach(([field, err]) => {
        formattedErrors[field] = err.message;
      });
    } else {
      formattedErrors._general = backendError.message || 'Error al procesar la solicitud';
    }
    
    setErrors(formattedErrors);
    console.error('Errores del backend:', backendError);
  } else {
    setErrors({ _general: error.message || 'Error de conexión con el servidor' });
    console.error('Error desconocido:', error);
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
              {!page.includes('confirmar-eliminar') && (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    minWidth: 120,
                    py: 1.5,
                    borderRadius: '8px'
                  }}
                  disabled={isSubmitting}
                >
                  Guardar
                </Button>
              )}
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Popup;
