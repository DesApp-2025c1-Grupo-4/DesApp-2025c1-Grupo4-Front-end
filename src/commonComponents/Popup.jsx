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
  deposito: { tipo: '', direccion: '', provincia: '', ciudad: '', pais: '', nombreContacto: '', apellidoContacto: '', telefonoContacto: '', horarios: { dias: [], desde: '', hasta: '' }, coordenadas: '' },
  viaje: { depositoOrigen: null, depositoDestino: null, fechaInicio: '', fechaFin: '', empresaTransportista: null, choferAsignado: null, vehiculoAsignado: null, tipoViaje: '' },
  chofer: { nombre: '', apellido: '', cuil: '', fechaNacimiento: '', empresa: '', vehiculoAsignado: '' },
  vehiculo: { patente: '', tipoVehiculo: '', marca: '', modelo: '', año: '', volumen: '', peso: '', empresa: '' },
  empresa: { nombre_empresa: '', cuit: '', datos_contacto: { mail: '', telefono: '' }, domicilio_fiscal: { calle: '', numero: '', ciudad: '', provincia: '', pais: '' } }
};

const Popup = ({ buttonName, page, open, onClose, children, selectedItem, onSuccess }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const formType = useMemo(() => {
    if (page.includes('deposito')) return 'deposito';
    if (page.includes('viaje')) return 'viaje';
    if (page.includes('chofer')) return 'chofer';
    if (page.includes('vehiculo')) return 'vehiculo';
    if (page.includes('empresa')) return 'empresa';
    return 'default';
  }, [page]);

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
        if (formType === 'viaje') {
          newFormData.idViaje = selectedItem._id || '';
          newFormData.depositoOrigen = selectedItem.depositoOrigen || null;
          newFormData.depositoDestino = selectedItem.depositoDestino || null;
          newFormData.fechaInicio = selectedItem.fechaInicio || '';
          newFormData.fechaFin = selectedItem.fechaFin || '';
          newFormData.empresaTransportista = selectedItem.empresaTransportista || null;
          newFormData.choferAsignado = selectedItem.choferAsignado || null;
          newFormData.vehiculoAsignado = selectedItem.vehiculoAsignado || null;
          newFormData.tipoViaje = selectedItem.tipoViaje || '';
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
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validationSchemas[formType].validateAt(name, formData)
      .then(() => setErrors(prev => ({ ...prev, [name]: '' })))
      .catch(error => setErrors(prev => ({ ...prev, [name]: error.message })));
  };

  const handleSubmit = async () => {
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    try {
      let formDataToValidate = { ...formData };
      if (formType === 'viaje') {
        ['depositoOrigen', 'depositoDestino', 'empresaTransportista', 'choferAsignado', 'vehiculoAsignado'].forEach(field => {
          const val = formDataToValidate[field];
          formDataToValidate[field] = val && typeof val === 'string' ? { _id: val } : val;
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
      if (formType === 'viaje') {
        if (!formData.empresaTransportista ||
            (typeof formData.empresaTransportista === 'object' && !formData.empresaTransportista._id)) {
          throw new Error('Debe seleccionar una empresa transportista válida');
        }

        dataToSend = {
          deposito_origen: formData.depositoOrigen?._id || formData.depositoOrigen,
          deposito_destino: formData.depositoDestino?._id || formData.depositoDestino,
          inicio_viaje: convertToBackendFormat(formData.fechaInicio),
          fin_viaje: convertToBackendFormat(formData.fechaFin),
          empresa_asignada: typeof formData.empresaTransportista === 'object'
            ? formData.empresaTransportista._id
            : formData.empresaTransportista,
          chofer_asignado: typeof formData.choferAsignado === 'object'
            ? formData.choferAsignado._id
            : formData.choferAsignado,
          vehiculo_asignado: typeof formData.vehiculoAsignado === 'object'
            ? formData.vehiculoAsignado._id
            : formData.vehiculoAsignado,
          estado: 'planificado'
        };
      }

      console.log('Payload enviado:', JSON.stringify(dataToSend, null, 2));

      const response = await axios({ method, url, data: dataToSend });
      if (onSuccess) onSuccess(response.data);
      handleClose();
      window.location.reload();
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        const backendError = error.response.data;
        const formattedErrors = backendError.errors
          ? Object.fromEntries(Object.entries(backendError.errors).map(([field, err]) => [field, err.message]))
          : { _general: backendError.message || 'Error al procesar la solicitud' };
        setErrors(formattedErrors);
        console.error('Errores del backend:', backendError);
      } else {
        setErrors({ _general: error.message || 'Error de conexión con el servidor' });
        console.error('Error desconocido:', error);
      }
    }
  };

  const renderForm = () => {
    if (children) return children;
    const formProps = { formData, handleChange, handleBlur, errors, isEditing: !!selectedItem };
    switch (formType) {
      case 'deposito': return <DepositoForm {...formProps} />;
      case 'viaje': return <ViajeForm {...formProps} />;
      case 'chofer': return <ChoferForm {...formProps} />;
      case 'vehiculo': return <VehiculoForm {...formProps} />;
      case 'empresa': return <EmpresaForm {...formProps} />;
      case 'seguimiento': return <SeguimientoForm formData={formData} />;
      default: return null;
    }
  };

  return (
    <>
      {!isControlled && (
        <Button variant="contained" onClick={() => setInternalOpen(true)}>{buttonName}</Button>
      )}
      <Dialog open={currentOpen} onClose={handleClose} fullWidth maxWidth="md" fullScreen={isMobile}>
        <Box>
          <DialogTitle>{ROUTE_CONFIG[`/${page}`]?.newButton || buttonName}</DialogTitle>
          <DialogContent>{renderForm()}</DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">Cancelar</Button>
            {!page.includes('confirmar-eliminar') && (
              <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>Guardar</Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Popup;
