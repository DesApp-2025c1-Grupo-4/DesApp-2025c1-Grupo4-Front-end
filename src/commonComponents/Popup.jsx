import { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions, 
  Box, 
  InputLabel, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { grey } from "@mui/material/colors";
import { ROUTE_CONFIG } from '../config/routesConfig';
import * as Yup from 'yup';
import ErrorText from './ErrorText';

// Esquemas de validación
const validationSchemas = {
  deposito: Yup.object().shape({
    tipo: Yup.string().required('El tipo de depósito es requerido'),
    horarios: Yup.string().required('Los horarios son requeridos'),
    calle: Yup.string().required('La dirección es requerida'),
    provincia: Yup.string().required('La provincia es requerida'),
    pais: Yup.string().required('El país es requerido'),
    nombreContacto: Yup.string().required('El nombre de contacto es requerido'),
    apellidoContacto: Yup.string().required('El apellido de contacto es requerido'),
    dniContacto: Yup.string()
      .required('El DNI es requerido')
      .matches(/^\d{7,8}$/, 'DNI inválido (7-8 dígitos)'),
    telefonoContacto: Yup.string()
      .required('El teléfono es requerido')
      .matches(/^[0-9]{10,15}$/, 'Teléfono inválido'),
    razonSocial: Yup.string().required('La razón social es requerida'),
    cuit: Yup.string()
      .required('El CUIT es requerido')
      .matches(/^\d{2}-\d{8}-\d{1}$/, 'Formato inválido (XX-XXXXXXXX-X)')
  }),
  viaje: Yup.object().shape({
    depositoOrigen: Yup.string().required('El depósito de origen es requerido'),
    depositoDestino: Yup.string().required('El depósito de destino es requerido'),
    fechaHoraInicio: Yup.date().required('La fecha de inicio es requerida'),
    empresa: Yup.string().required('La empresa es requerida'),
    chofer: Yup.string().required('El chofer es requerido'),
    vehiculo: Yup.string().required('El vehículo es requerido'),
    tipoViaje: Yup.string().required('El tipo de viaje es requerido')
  }),
  chofer: Yup.object().shape({
    nombre: Yup.string().required('El nombre es requerido'),
    apellido: Yup.string().required('El apellido es requerido'),
    dni: Yup.string()
      .required('El DNI es requerido')
      .matches(/^\d{7,8}$/, 'DNI inválido (7-8 dígitos)'),
    fechaNacimiento: Yup.date()
      .required('La fecha de nacimiento es requerida')
      .max(new Date(), 'La fecha no puede ser futura'),
    empresa: Yup.string().required('La empresa es requerida')
  }),
  vehiculo: Yup.object().shape({
    patente: Yup.string()
      .required('La patente es requerida')
      .matches(/^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/, 'Patente inválida'),
    tipoVehiculo: Yup.string().required('El tipo de vehículo es requerido'),
    marca: Yup.string().required('La marca es requerida'),
    modelo: Yup.string().required('El modelo es requerido'),
    año: Yup.number()
      .required('El año es requerido')
      .min(1990, 'Año mínimo: 1990')
      .max(new Date().getFullYear(), 'Año no puede ser futuro'),
    volumen: Yup.number().required('El volumen es requerido').min(0),
    peso: Yup.number().required('El peso es requerido').min(0),
    empresa: Yup.string().required('La empresa es requerida')
  }),
  default: Yup.object().shape({
    razonSocial: Yup.string().required('La razón social es requerida'),
    cuit: Yup.string()
      .required('El CUIT es requerido')
      .matches(/^\d{2}-\d{8}-\d{1}$/, 'Formato inválido (XX-XXXXXXXX-X)'),
    domicilio: Yup.string().required('El domicilio es requerido'),
    telefono: Yup.string()
      .required('El teléfono es requerido')
      .matches(/^[0-9]{10,15}$/, 'Teléfono inválido')
  })
};

const Popup = ({ buttonName, page, open, onClose, children, selectedItem }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const currentOnClose = isControlled ? onClose : () => setInternalOpen(false);

  const currentPage = ROUTE_CONFIG[`/${page}`];

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

  const [formData, setFormData] = useState(() => {
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
  });

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
        const schema = getValidationSchema();
        await schema.validateAt(name, { [name]: value });
        setErrors(prev => ({ ...prev, [name]: '' }));
      } catch (error) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const handleBlur = (e) => {
  const { name } = e.target;
  setTouched(prev => ({ ...prev, [name]: true }));
  
  const schema = getValidationSchema();
  schema.validateAt(name, formData)
    .then(() => setErrors(prev => ({ ...prev, [name]: '' })))
    .catch(error => setErrors(prev => ({ ...prev, [name]: error.message })));
  };

  const handleSubmit = async () => {
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    try {
      const schema = getValidationSchema();
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      console.log('Form submitted:', formData);
      currentOnClose();
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  const renderDepositoForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Tipo de Depósito</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="tipo" 
          value={formData.tipo} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.tipo}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.tipo && <ErrorText>{errors.tipo}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Franja Horaria</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="horarios" 
          value={formData.horarios} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.horarios}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.horarios && <ErrorText>{errors.horarios}</ErrorText>}

        <InputLabel sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Localización</InputLabel>
        <TextField 
          fullWidth 
          required 
          margin="dense" 
          name="calle" 
          label="Dirección" 
          value={formData.calle} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.calle}
          sx={{backgroundColor: grey[50], mb: 1}} 
        />
        {errors.calle && <ErrorText>{errors.calle}</ErrorText>}
        
        <TextField 
          fullWidth 
          margin="dense" 
          name="numero" 
          label="Número" 
          value={formData.numero} 
          onChange={handleChange}
          sx={{backgroundColor: grey[50], mb: 1}} 
        />
        
        <TextField 
          fullWidth 
          required 
          margin="dense" 
          name="provincia" 
          label="Provincia/Estado" 
          value={formData.provincia} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.provincia}
          sx={{backgroundColor: grey[50], mb: 1}} 
        />
        {errors.provincia && <ErrorText>{errors.provincia}</ErrorText>}
        
        <TextField 
          fullWidth 
          required 
          margin="dense" 
          name="pais" 
          label="País" 
          value={formData.pais} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.pais}
          sx={{backgroundColor: grey[50], mb: 1}} 
        />
        {errors.pais && <ErrorText>{errors.pais}</ErrorText>}
        
        <TextField 
          fullWidth 
          margin="dense" 
          name="coordenadas" 
          label="Coordenadas (opcional)" 
          value={formData.coordenadas} 
          onChange={handleChange}
          sx={{backgroundColor: grey[50]}} 
        />
      </Grid>

      <Grid item xs={6}>
        <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>Personal de Contacto</InputLabel>
        <TextField 
          fullWidth 
          required 
          margin="dense" 
          name="nombreContacto" 
          label="Nombre" 
          value={formData.nombreContacto} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.nombreContacto}
          sx={{backgroundColor: grey[50], mb: 1}} 
        />
        {errors.nombreContacto && <ErrorText>{errors.nombreContacto}</ErrorText>}
        
        <TextField 
          fullWidth 
          required 
          margin="dense" 
          name="apellidoContacto" 
          label="Apellido" 
          value={formData.apellidoContacto} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.apellidoContacto}
          sx={{backgroundColor: grey[50], mb: 1}} 
        />
        {errors.apellidoContacto && <ErrorText>{errors.apellidoContacto}</ErrorText>}
        
        <TextField 
          fullWidth 
          required 
          margin="dense" 
          name="dniContacto" 
          label="DNI" 
          value={formData.dniContacto} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.dniContacto}
          sx={{backgroundColor: grey[50], mb: 1}} 
        />
        {errors.dniContacto && <ErrorText>{errors.dniContacto}</ErrorText>}
        
        <TextField 
          fullWidth 
          required 
          margin="dense" 
          name="telefonoContacto" 
          label="Teléfono" 
          value={formData.telefonoContacto} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.telefonoContacto}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.telefonoContacto && <ErrorText>{errors.telefonoContacto}</ErrorText>}

        <InputLabel sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Información Legal</InputLabel>
        <TextField 
          fullWidth 
          required 
          margin="dense" 
          name="razonSocial" 
          label="Razón Social" 
          value={formData.razonSocial} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.razonSocial}
          sx={{backgroundColor: grey[50], mb: 1}} 
        />
        {errors.razonSocial && <ErrorText>{errors.razonSocial}</ErrorText>}
        
        <TextField 
          fullWidth 
          required 
          margin="dense" 
          name="cuit" 
          label="CUIT/RUT" 
          value={formData.cuit} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.cuit}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.cuit && <ErrorText>{errors.cuit}</ErrorText>}
      </Grid>
    </Grid>
  );

  const renderViajeForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Depósito de Origen</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="depositoOrigen" 
          value={formData.depositoOrigen} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.depositoOrigen}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.depositoOrigen && <ErrorText>{errors.depositoOrigen}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Depósito de Destino</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="depositoDestino" 
          value={formData.depositoDestino} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.depositoDestino}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.depositoDestino && <ErrorText>{errors.depositoDestino}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Fecha y Hora de Inicio</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="fechaHoraInicio" 
          type="datetime-local" 
          value={formData.fechaHoraInicio} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.fechaHoraInicio}
          InputLabelProps={{ shrink: true }}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.fechaHoraInicio && <ErrorText>{errors.fechaHoraInicio}</ErrorText>}
      </Grid>

      <Grid item xs={6}>
        <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>Fecha y Hora de Fin</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="fechaHoraFin" 
          type="datetime-local" 
          value={formData.fechaHoraFin} 
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{backgroundColor: grey[50]}} 
        />

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Empresa</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="empresa" 
          value={formData.empresa} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.empresa}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.empresa && <ErrorText>{errors.empresa}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Chofer</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="chofer" 
          value={formData.chofer} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.chofer}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.chofer && <ErrorText>{errors.chofer}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Vehículo</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="vehiculo" 
          value={formData.vehiculo} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.vehiculo}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.vehiculo && <ErrorText>{errors.vehiculo}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Tipo de Viaje</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="tipoViaje" 
          value={formData.tipoViaje} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.tipoViaje}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.tipoViaje && <ErrorText>{errors.tipoViaje}</ErrorText>}
      </Grid>
    </Grid>
  );

  const renderChoferForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Nombre</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="nombre" 
          value={formData.nombre} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.nombre}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.nombre && <ErrorText>{errors.nombre}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Apellido</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="apellido" 
          value={formData.apellido} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.apellido}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.apellido && <ErrorText>{errors.apellido}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>DNI</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="dni" 
          value={formData.dni} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.dni}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.dni && <ErrorText>{errors.dni}</ErrorText>}
      </Grid>

      <Grid item xs={6}>
        <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Fecha de Nacimiento</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="fechaNacimiento" 
          type="date" 
          InputLabelProps={{ shrink: true }} 
          value={formData.fechaNacimiento} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.fechaNacimiento}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.fechaNacimiento && <ErrorText>{errors.fechaNacimiento}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Empresa</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="empresa" 
          value={formData.empresa} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.empresa}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.empresa && <ErrorText>{errors.empresa}</ErrorText>}

        <InputLabel sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Vehículo Asignado</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="vehiculoAsignado" 
          value={formData.vehiculoAsignado} 
          onChange={handleChange}
          sx={{backgroundColor: grey[50]}} 
        />
      </Grid>
    </Grid>
  );

  const renderVehiculoForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Patente</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="patente" 
          value={formData.patente} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.patente}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.patente && <ErrorText>{errors.patente}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Tipo de Vehículo</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="tipoVehiculo" 
          value={formData.tipoVehiculo} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.tipoVehiculo}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.tipoVehiculo && <ErrorText>{errors.tipoVehiculo}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Marca</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="marca" 
          value={formData.marca} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.marca}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.marca && <ErrorText>{errors.marca}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Modelo</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="modelo" 
          value={formData.modelo} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.modelo}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.modelo && <ErrorText>{errors.modelo}</ErrorText>}
      </Grid>

      <Grid item xs={6}>
        <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Capacidad (Volumen)</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="volumen" 
          value={formData.volumen} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.volumen}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.volumen && <ErrorText>{errors.volumen}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Capacidad (Peso)</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="peso" 
          value={formData.peso} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.peso}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.peso && <ErrorText>{errors.peso}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Año</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="año" 
          value={formData.año} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.año}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.año && <ErrorText>{errors.año}</ErrorText>}

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Empresa</InputLabel>
        <TextField 
          fullWidth 
          margin="dense" 
          name="empresa" 
          value={formData.empresa} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.empresa}
          sx={{backgroundColor: grey[50]}} 
        />
        {errors.empresa && <ErrorText>{errors.empresa}</ErrorText>}
      </Grid>
    </Grid>
  );

  const renderSeguimiento = () => (
    <>
      <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>ID de Viaje</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="idViaje" 
        value={formData.idViaje} 
        onChange={handleChange}
        sx={{backgroundColor: grey[50]}} 
      />

      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Horario</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Ubicación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>2023-10-01 08:00</TableCell>
                <TableCell>En camino</TableCell>
                <TableCell>Ubicación A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-10-01 10:30</TableCell>
                <TableCell>En espera</TableCell>
                <TableCell>Ubicación B</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );

  const renderDefaultForm = () => (
    <>
      <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Razon Social</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="razonSocial" 
        value={formData.razonSocial} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.razonSocial}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.razonSocial && <ErrorText>{errors.razonSocial}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>CUIT/RUT</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="cuit" 
        value={formData.cuit} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.cuit}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.cuit && <ErrorText>{errors.cuit}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Domicilio Fiscal</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="domicilio" 
        value={formData.domicilio} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.domicilio}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.domicilio && <ErrorText>{errors.domicilio}</ErrorText>}

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Telefono</InputLabel>
      <TextField 
        fullWidth 
        margin="dense" 
        name="telefono" 
        value={formData.telefono} 
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.telefono}
        sx={{backgroundColor: grey[50]}} 
      />
      {errors.telefono && <ErrorText>{errors.telefono}</ErrorText>}
    </>
  );

  const renderFormContent = () => {
    if (children) return children;
    if (page.includes('deposito')) return renderDepositoForm();
    if (page.includes('viaje')) return renderViajeForm();
    if (page.includes('chofer')) return renderChoferForm();
    if (page.includes('vehiculo')) return renderVehiculoForm();
    if (page.includes('seguimiento')) return renderSeguimiento();
    return renderDefaultForm();
  };

  return (
    <>
      {!isControlled && <Button fullWidth variant="contained" color="primary" onClick={() => setInternalOpen(true)}>{buttonName}</Button>}
    
      <Dialog open={currentOpen} onClose={currentOnClose} fullWidth sx={{backgroundColor: grey[50]}}>
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2}}>
          {currentPage?.logo}
          <DialogTitle color="primary" fontWeight={'bold'}>{currentPage?.newButton || buttonName}</DialogTitle>
        </Box>
        <Box sx={{backgroundColor: grey[300], pb: 2}}>
          <DialogContent>{renderFormContent()}</DialogContent>
          <DialogActions sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 6}}>
            <Button variant='contained' sx={{fontSize: '0.9em'}} onClick={currentOnClose}>Cancelar</Button>
            <Button 
              variant="contained" 
              sx={{fontSize: '0.9em'}} 
              color="secondary" 
              onClick={handleSubmit}
              disabled={Object.keys(errors).some(key => errors[key])}
            >
              {page.includes('registrar') ? 'Registrar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Popup;