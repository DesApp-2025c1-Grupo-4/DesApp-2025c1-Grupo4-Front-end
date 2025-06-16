import * as Yup from 'yup';

const validationSchemas = {
  deposito: Yup.object().shape({
    tipo: Yup.string().required('El tipo de depósito es requerido (ej: Almacén, Centro de distribución)'),
    horarios: Yup.string().required('Los horarios son requeridos (ej: Lunes a Viernes 8:00-18:00)'),
    calle: Yup.string().required('La dirección es requerida (ej: Av. Corrientes 123)'),
    provincia: Yup.string().required('La provincia es requerida (ej: Buenos Aires)'),
    pais: Yup.string().required('El país es requerido (ej: Argentina)'),
    nombreContacto: Yup.string().required('El nombre de contacto es requerido (ej: Juan)'),
    apellidoContacto: Yup.string().required('El apellido de contacto es requerido (ej: Pérez)'),
    dniContacto: Yup.string()
      .required('El DNI es requerido')
      .matches(/^\d{7,8}$/, 'DNI inválido. Debe tener 7 u 8 dígitos (ej: 12345678)'),
    telefonoContacto: Yup.string()
      .required('El teléfono es requerido')
      .matches(/^[0-9]{10,15}$/, 'Teléfono inválido. Debe tener 10-15 dígitos (ej: 1123456789)'),
    razonSocial: Yup.string().required('La razón social es requerida (ej: Logística S.A.)'),
    cuit: Yup.string()
      .required('El CUIT es requerido')
      .matches(/^\d{2}-\d{8}-\d{1}$/, 'Formato inválido. Debe ser XX-XXXXXXXX-X (ej: 30-12345678-9)')
  }),
  viaje: Yup.object().shape({
    depositoOrigen: Yup.string().required('Seleccione el depósito de origen (ej: Depósito Norte)'),
    depositoDestino: Yup.string().required('Seleccione el depósito de destino (ej: Depósito Sur)'),
    fechaHoraInicio: Yup.date().required('Ingrese fecha y hora de inicio (ej: 01/01/2023 08:00)'),
    empresa: Yup.string().required('Seleccione la empresa transportista'),
    chofer: Yup.string().required('Seleccione el chofer asignado'),
    vehiculo: Yup.string().required('Seleccione el vehículo asignado'),
    tipoViaje: Yup.string().required('Seleccione el tipo de viaje (ej: Urgente, Estándar)')
  }),
  chofer: Yup.object().shape({
    nombre: Yup.string().required('El nombre es requerido (ej: Carlos)'),
    apellido: Yup.string().required('El apellido es requerido (ej: Gómez)'),
    dni: Yup.string()
      .required('El DNI es requerido')
      .matches(/^\d{7,8}$/, 'DNI inválido. Debe tener 7 u 8 dígitos (ej: 23456789)'),
    fechaNacimiento: Yup.date()
      .required('La fecha de nacimiento es requerida (ej: 01/01/1980)')
      .max(new Date(), 'La fecha no puede ser futura'),
    empresa: Yup.string().required('Seleccione la empresa asociada')
  }),
  vehiculo: Yup.object().shape({
    patente: Yup.string()
      .required('La patente es requerida')
      .matches(/^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/, 'Patente inválida. Formato: AA123BB o ABC123 (ej: AB123CD)'),
    tipoVehiculo: Yup.string().required('Seleccione el tipo de vehículo (ej: Camión, Furgón)'),
    marca: Yup.string().required('La marca es requerida (ej: Ford, Mercedes-Benz)'),
    modelo: Yup.string().required('El modelo es requerido (ej: F-150, Sprinter)'),
    año: Yup.number()
      .required('El año es requerido (ej: 2020)')
      .min(1990, 'Año mínimo: 1990')
      .max(new Date().getFullYear(), 'Año no puede ser futuro'),
    volumen: Yup.number().required('El volumen es requerido en m³ (ej: 50)').min(0),
    peso: Yup.number().required('El peso es requerido en kg (ej: 3000)').min(0),
    empresa: Yup.string().required('Seleccione la empresa asociada')
  }),
  default: Yup.object().shape({
    razonSocial: Yup.string().required('La razón social es requerida (ej: Transportes del Sur S.A.)'),
    cuit: Yup.string()
      .required('El CUIT es requerido')
      .matches(/^\d{2}-\d{8}-\d{1}$/, 'Formato inválido. Debe ser XX-XXXXXXXX-X (ej: 30-12345678-9)'),
    domicilio: Yup.string().required('El domicilio es requerido (ej: Av. Libertador 1234)'),
    telefono: Yup.string()
      .required('El teléfono es requerido')
      .matches(/^[0-9]{10,15}$/, 'Teléfono inválido. Debe tener 10-15 dígitos (ej: 1123456789)')
  })
};

export default validationSchemas;