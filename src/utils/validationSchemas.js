import * as Yup from 'yup';

export const depositoSchema = Yup.object().shape({
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
});

export const viajeSchema = Yup.object().shape({
  depositoOrigen: Yup.string().required('El depósito de origen es requerido'),
  depositoDestino: Yup.string().required('El depósito de destino es requerido'),
  fechaHoraInicio: Yup.date().required('La fecha de inicio es requerida'),
  empresa: Yup.string().required('La empresa es requerida'),
  chofer: Yup.string().required('El chofer es requerido'),
  vehiculo: Yup.string().required('El vehículo es requerido'),
  tipoViaje: Yup.string().required('El tipo de viaje es requerido')
});

export const choferSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  apellido: Yup.string().required('El apellido es requerido'),
  dni: Yup.string()
    .required('El DNI es requerido')
    .matches(/^\d{7,8}$/, 'DNI inválido (7-8 dígitos)'),
  fechaNacimiento: Yup.date()
    .required('La fecha de nacimiento es requerida')
    .max(new Date(), 'La fecha no puede ser futura'),
  empresa: Yup.string().required('La empresa es requerida')
});

export const vehiculoSchema = Yup.object().shape({
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
});

export const empresaSchema = Yup.object().shape({
  razonSocial: Yup.string().required('La razón social es requerida'),
  cuit: Yup.string()
    .required('El CUIT es requerido')
    .matches(/^\d{2}-\d{8}-\d{1}$/, 'Formato inválido (XX-XXXXXXXX-X)'),
  domicilio: Yup.string().required('El domicilio es requerido'),
  telefono: Yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]{10,15}$/, 'Teléfono inválido')
});