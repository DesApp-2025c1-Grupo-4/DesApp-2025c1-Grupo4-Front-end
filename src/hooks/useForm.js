import { useState } from 'react';
import {Button, Dialog, DialogTitle, DialogContent,DialogActions, Box} from '@mui/material';
import { grey } from '@mui/material/colors';
import { ROUTE_CONFIG } from '../config/routesConfig';
import validationSchemas from '../validations/validationSchemas';
import DepositoForm from '../forms/DepositoForm';
import ViajeForm from '../forms/ViajeForm';
import ChoferForm from '../forms/ChoferForm';
import VehiculoForm from '../forms/VehiculoForm';
import DefaultForm from '../forms/DefaultForm';
import SeguimientoForm from '../forms/SeguimientoForm';

const Popup = ({ buttonName, page, open, onClose, children, selectedItem }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const currentOnClose = isControlled ? onClose : () => setInternalOpen(false);

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
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    try {
      await getValidationSchema().validate(formData, { abortEarly: false });
      setErrors({});
      console.log('Submit:', formData);
      currentOnClose();
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(err => newErrors[err.path] = err.message);
      setErrors(newErrors);
    }
  };

  const renderForm = () => {
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

      <Dialog open={currentOpen} onClose={currentOnClose} fullWidth>
        <Box>
          {ROUTE_CONFIG[`/${page}`]?.logo}
          <DialogTitle>{ROUTE_CONFIG[`/${page}`]?.newButton || buttonName}</DialogTitle>
        </Box>
        <Box sx={{ backgroundColor: grey[300], pb: 2 }}>
          <DialogContent>{renderForm()}</DialogContent>
          <DialogActions>
            <Button onClick={currentOnClose}>Cancelar</Button>
            <Button onClick={handleSubmit} color="secondary" disabled={Object.values(errors).some(Boolean)}>Guardar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Popup;