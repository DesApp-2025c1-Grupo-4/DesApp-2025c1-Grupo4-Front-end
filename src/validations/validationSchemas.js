import * as Yup from 'yup';

const errorMessages = {
  required: (field) => `${field} es requerido`,
  invalid: (field) => `${field} no es válido`,
  minLength: (field, min) => `${field} debe tener al menos ${min} caracteres`,
  maxLength: (field, max) => `${field} no puede exceder ${max} caracteres`,
};

const parseCustomDate = (value, originalValue) => {
  if (value instanceof Date && !isNaN(value)) return value;
  if (typeof originalValue !== 'string') return new Date('');

  const dateParts = originalValue.split(/[/\s-]/);
  const timePart = originalValue.includes(' ') ? originalValue.split(' ')[1] : '00:00';

  if (dateParts.length < 3) return new Date('');

  let [day, month, year] = dateParts;
  if (year.length === 2) year = `20${year}`;

  if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date('');

  const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart.includes(':') ? timePart : '00:00'}`;
  const parsedDate = new Date(isoString);

  return isNaN(parsedDate) ? new Date('') : parsedDate;
};

const schemaOptions = {
  abortEarly: false,
  strict: true,
  stripUnknown: true,
};

const validations = {
  phone: (fieldName = 'Teléfono') => Yup.string()
    .trim()
    .required(errorMessages.required(fieldName))
    .test('is-not-empty', errorMessages.required(fieldName), value => {
      return value && value.trim().length > 0;
    })
    .matches(/^[0-9]{10,15}$/, errorMessages.invalid(fieldName)),

  email: (fieldName = 'Email') => Yup.string()
    .trim()
    .required(errorMessages.required(fieldName))
    .test('is-not-empty', errorMessages.required(fieldName), value => {
      return value && value.trim().length > 0;
    })
    .email(errorMessages.invalid(fieldName))
    .max(100, errorMessages.maxLength(fieldName, 100)),

  requiredString: (fieldName = 'Campo') => Yup.string()
    .trim()
    .required(errorMessages.required(fieldName))
    .test('is-not-empty', errorMessages.required(fieldName), value => {
      return value && value.trim().length > 0;
    })
    .max(100, errorMessages.maxLength(fieldName, 100)),

  date: (fieldName = 'Fecha') => Yup.date()
    .transform(parseCustomDate)
    .required(errorMessages.required(fieldName))
    .typeError(errorMessages.invalid(fieldName))
    .test('is-not-empty', errorMessages.required(fieldName), value => {
      return value && !isNaN(value.getTime());
    }),

  cuit: (fieldName = 'CUIT') => Yup.string()
    .trim()
    .required(errorMessages.required(fieldName))
    .test('is-not-empty', errorMessages.required(fieldName), value => {
      return value && value.trim().length > 0;
    })
    .matches(/^\d{11}$/, errorMessages.invalid(fieldName))
    .test('valid-cuit', errorMessages.invalid(fieldName), value => {
      if (!value) return false;
      const validPrefixes = ['20', '23', '24', '27', '30', '33', '34'];
      return validPrefixes.includes(value.slice(0, 2));
    }),

  requiredNumber: (fieldName = 'Campo') => Yup.number()
    .required(errorMessages.required(fieldName))
    .typeError(errorMessages.invalid(fieldName))
    .test('is-not-empty', errorMessages.required(fieldName), value => {
      return value !== null && value !== undefined;
    }),
};

const validationSchemas = {
  deposito: Yup.object(schemaOptions).shape({
    tipo: validations.requiredString('Tipo de depósito')
      .oneOf(['Propio', 'Tercerizado'], errorMessages.invalid('Tipo de depósito')),

    horarios: Yup.object().shape({
      desde: validations.requiredString('Hora de apertura')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, errorMessages.invalid('Hora')),
      hasta: validations.requiredString('Hora de cierre')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, errorMessages.invalid('Hora'))
        .test('is-after', 'Debe ser posterior a la hora de apertura', function(value) {
          const { desde } = this.parent;
          return !desde || !value || value > desde;
        })
    }),

    direccion: validations.requiredString('Dirección'),
    provincia: validations.requiredString('Provincia'),
    ciudad: validations.requiredString('Ciudad'),
    pais: validations.requiredString('País'),
    nombreContacto: validations.requiredString('Nombre de contacto'),
    apellidoContacto: validations.requiredString('Apellido de contacto'),
    telefonoContacto: validations.phone('Teléfono de contacto'),
  }),

  viaje: Yup.object(schemaOptions).shape({
    depositoOrigen: Yup.object().required('Depósito origen es requerido'),
    depositoDestino: Yup.object().required('Depósito destino es requerido'),
    fechaInicio: Yup.date()
      .transform(parseCustomDate)
      .required('Fecha de inicio es requerida')
      .typeError('Fecha inválida'),
    fechaFin: Yup.date()
      .transform(parseCustomDate)
      .required('Fecha de fin es requerida')
      .typeError('Fecha inválida')
      .min(Yup.ref('fechaInicio'), 'La fecha de fin debe ser posterior a la fecha de inicio')
      .test('is-after', 'La fecha de fin debe ser posterior a la fecha de inicio', function(value) {
        const { fechaInicio } = this.parent;
        if (!fechaInicio || !value) return true;
        return new Date(value) > new Date(fechaInicio);
      }),
    empresaTransportista: Yup.object().required('Empresa transportista es requerida'),
    choferAsignado: Yup.object().required('Chofer asignado es requerido'),
    vehiculoAsignado: Yup.object().required('Vehículo asignado es requerido'),
    tipoViaje: Yup.string()
      .required('Tipo de viaje es requerido')
      .oneOf(['Nacional', 'Internacional'], 'Tipo de viaje inválido'),
  }),

  chofer: Yup.object(schemaOptions).shape({
    nombre: validations.requiredString('El nombre'),
    apellido: validations.requiredString('El apellido'),
    cuil: validations.cuit(),
    fechaNacimiento: Yup.date()
      .transform(parseCustomDate)
      .required('Fecha de nacimiento requerida')
      .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'El chofer debe ser mayor de 18 años'),
    licenciaNumero: Yup.string()
      .required('Número de licencia requerido')
      .matches(/^[A-Z0-9]{6,12}$/, 'Formato inválido (6-12 caracteres alfanuméricos)'),
    licenciaTipo: Yup.array()
      .min(1, 'Seleccione al menos un tipo')
      .of(Yup.string().oneOf(['A', 'B', 'C', 'D', 'E'], 'Tipo de licencia inválido')),
    licenciaExpiracion: Yup.date()
      .transform(parseCustomDate)
      .required('Fecha de expiración requerida')
      .min(new Date(), 'La licencia no puede estar vencida'),
  }),

  vehiculo: Yup.object(schemaOptions).shape({
    patente: validations.requiredString('Patente')
      .matches(/^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/, errorMessages.invalid('Patente')),
    
    tipoVehiculo: validations.requiredString('Tipo de vehículo')
      .oneOf(['Camión', 'Furgón', 'Camioneta', 'Trailer', 'Semirremolque'], errorMessages.invalid('Tipo de vehículo')),
    
    marca: validations.requiredString('Marca'),
    modelo: validations.requiredString('Modelo'),
    
    año: validations.requiredNumber('Año')
      .integer(errorMessages.invalid('Año'))
      .min(1990, 'El año mínimo es 1990')
      .max(new Date().getFullYear() + 1, 'No puede ser mayor al año actual + 1'),
    
    volumen: validations.requiredNumber('Volumen')
      .positive('Debe ser un valor positivo')
      .max(1000, 'El volumen máximo es 1000 m³'),
    
    peso: validations.requiredNumber('Peso')
      .positive('Debe ser un valor positivo')
      .max(50000, 'El peso máximo es 50,000 kg'),
  }),

  empresa: Yup.object(schemaOptions).shape({
    nombre_empresa: validations.requiredString('La razón social'),
    cuit: validations.cuit(),
    datos_contacto: Yup.object().shape({
      mail: validations.email(),
      telefono: validations.phone(),
    }),
    domicilio_fiscal: Yup.object().shape({
      direccion: validations.requiredString('La dirección'),
      ciudad: validations.requiredString('La ciudad'),
      provincia_estado: validations.requiredString('La provincia/estado'),
      pais: validations.requiredString('El país'),
    }),
  }),

  default: Yup.object(schemaOptions).shape({
    razonSocial: validations.requiredString('La razón social'),
    cuit: validations.cuit(),
    domicilio: validations.requiredString('El domicilio'),
    telefono: validations.phone(),
  }),
};

export default validationSchemas;