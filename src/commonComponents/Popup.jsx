import { useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Box
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { ROUTE_CONFIG } from '../config/routesConfig';
import validationSchemas from '../validations/validationSchemas';
import DepositoForm from './forms/DepositoForm';
import ViajeForm from './forms/ViajeForm';
import ChoferForm from './forms/ChoferForm';
import VehiculoForm from './forms/VehiculoForm';
import DefaultForm from './forms/DefaultForm';
import SeguimientoForm from './forms/SeguimientoForm';

const Popup = ({ buttonName, page, open, onClose, children, selectedItem }) => {
  const [internalOpen, setInternalOpen] = useState(false);

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
      nombre: '', apellido: '', dni: '', fechaNacimiento: '', empresa: '', vehiculoAsignado: ''
    },
    vehiculo: {
      patente: '', tipoVehiculo: '', marca: '', modelo: '', año: '', volumen: '', peso: '', empresa: ''
    },
    default: {
      razonSocial: '', cuit: '', domicilio: '', telefono: ''
    }
  };

  const getInitialFormData = () => {
    if (!selectedItem) return initialData[page.includes('deposito') ? 'deposito' : 
                            page.includes('viaje') ? 'viaje' : 
                            page.includes('chofer') ? 'chofer' : 
                            page.includes('vehiculo') ? 'vehiculo' : 'default'];

    if (page.includes('deposito')) {
      return {
        ...initialData.deposito,
        tipo: selectedItem?.tipo || '',
        horarios: selectedItem?.horarios || '',
        calle: selectedItem?.localizacion?.calle || '',
        numero: selectedItem?.localizacion?.número || '',
        provincia: selectedItem?.localizacion?.provincia || '',
        pais: selectedItem?.localizacion?.pais || '',
        coordenadas: selectedItem?.localizacion?.coordenadas || '',
        nombreContacto: selectedItem?.contacto?.nombre || '',
        apellidoContacto: selectedItem?.contacto?.apellido || '',
        dniContacto: selectedItem?.contacto?.dni || '',
        telefonoContacto: selectedItem?.contacto?.telefono || '',
        razonSocial: selectedItem?.razonSocial || '',
        cuit: selectedItem?.cuit || ''
      };
    }

    if (page.includes('viaje')) {
      return {
        ...initialData.viaje,
        idViaje: selectedItem?._id || '',
        depositoOrigen: selectedItem?.origen || '',
        depositoDestino: selectedItem?.destino || '',
        fechaHoraInicio: selectedItem?.fechaInicio || '',
        fechaHoraFin: selectedItem?.fechaFin || '',
        empresa: selectedItem?.empresaTransportista || '',
        chofer: selectedItem?.nombreChofer || '',
        vehiculo: selectedItem?.patenteVehiculo || '',
        tipoViaje: selectedItem?.tipoViaje || '',
        estado: selectedItem?.estado || ''
      };
    }

    if (page.includes('chofer')) {
      return {
        ...initialData.chofer,
        nombre: selectedItem?.nombre || '',
        apellido: selectedItem?.apellido || '',
        dni: selectedItem?.dni || '',
        fechaNacimiento: selectedItem?.fechaNacimiento || '',
        empresa: selectedItem?.empresa || '',
        vehiculoAsignado: selectedItem?.vehiculoAsignado || ''
      };
    }

    if (page.includes('vehiculo')) {
      return {
        ...initialData.vehiculo,
        patente: selectedItem?.patente || '',
        tipoVehiculo: selectedItem?.tipoVehiculo || '',
        marca: selectedItem?.marca || '',
        modelo: selectedItem?.modelo || '',
        año: selectedItem?.año || '',
        volumen: selectedItem?.volumen || '',
        peso: selectedItem?.peso || '',
        empresa: selectedItem?.empresa || ''
      };
    }

    return {
      ...initialData.default,
      razonSocial: selectedItem?.razonSocial || '',
      cuit: selectedItem?.cuit || '',
      domicilio: selectedItem?.domicilioFiscal || '',
      telefono: selectedItem?.telefono || ''
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  
  const handleClose = () => {
    setFormData(getInitialFormData());
    setErrors({});
    setTouched({});
    
    if (isControlled) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const getValidationSchema = () => {
    if (page.includes('deposito')) return validationSchemas.deposito;
    if (page.includes('viaje')) return validationSchemas.viaje;
    if (page.includes('chofer')) return validationSchemas.chofer;
    if (page.includes('vehiculo')) return validationSchemas.vehiculo;
    return validationSchemas.default;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      try {
        await getValidationSchema().validateAt(name, { [name]: value });
        setErrors(prev => ({ ...prev, [name]: '' }));
      } catch (err) {
        setErrors(prev => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    getValidationSchema().validateAt(name, formData)
      .then(() => setErrors(prev => ({ ...prev, [name]: '' })))
      .catch(error => setErrors(prev => ({ ...prev, [name]: error.message })));
  };

  const handleSubmit = async () => {
    if (page.includes('confirmar-eliminar')) {
      console.log('Eliminando elemento:', selectedItem);
      // Aqui deberias llamar a tu API para eliminar el elemento
      // Ejemplo: await deleteViaje(selectedItem._id);
      handleClose();
      return;
    }

    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    try {
      await getValidationSchema().validate(formData, { abortEarly: false });
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
        <Box>
          <p>¿Estás seguro que deseas eliminar este elemento?</p>
          <p>Esta acción no se puede deshacer.</p>
        </Box>
      );
    }
    if (children) return children;
    if (page.includes('deposito')) return <DepositoForm formData={formData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />;
    if (page.includes('viaje')) return <ViajeForm formData={formData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />;
    if (page.includes('chofer')) return <ChoferForm formData={formData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />;
    if (page.includes('vehiculo')) return <VehiculoForm formData={formData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />;
    if (page.includes('seguimiento')) return <SeguimientoForm formData={formData} />;
    return <DefaultForm formData={formData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />;
  };

  return (
    <>
      {!isControlled && (
        <Button fullWidth variant="contained" onClick={() => setInternalOpen(true)}>{buttonName}</Button>
      )}

      <Dialog 
        open={currentOpen} 
        onClose={handleClose} 
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: page.includes('confirmar-eliminar') ? 'rgba(255, 235, 235, 0.9)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            borderRadius: '8px',
            p: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <Box sx={{ 
          backgroundColor: 'transparent',
          borderRadius: '8px',
          pb: 2 
        }}>
          {!page.includes('confirmar-eliminar') && ROUTE_CONFIG[`/${page}`]?.logo}
          <DialogTitle sx={{ 
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: page.includes('confirmar-eliminar') ? 'error.main' : 'inherit'
          }}>
            {page.includes('confirmar-eliminar') 
              ? 'Confirmar eliminación' 
              : ROUTE_CONFIG[`/${page}`]?.newButton || buttonName}
          </DialogTitle>
          <Box sx={{ 
            backgroundColor: page.includes('confirmar-eliminar') 
              ? 'rgba(255, 235, 235, 0.5)' 
              : 'rgba(245, 245, 245, 0.8)',
            borderRadius: '8px',
            p: 3
          }}>
            <DialogContent sx={{ py: 2 }}>{renderForm()}</DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                onClick={handleClose} 
                variant="outlined"
                sx={{ mr: 2 }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                color={page.includes('confirmar-eliminar') ? 'error' : 'secondary'}
                variant="contained"
                disabled={Object.values(errors).some(Boolean) && !page.includes('confirmar-eliminar')}
              >
                {page.includes('confirmar-eliminar') ? 'Eliminar definitivamente' : 'Guardar'}
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Popup;