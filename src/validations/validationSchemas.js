import * as Yup from 'yup';

const parseCustomDate = (value, originalValue) => {
  if (value instanceof Date && !isNaN(value)) return value;

  if (typeof originalValue !== 'string') return new Date('');

  const [datePart, timePart] = originalValue.split(' ');
  if (!datePart || !timePart) return new Date('');

  const [day, month, year] = datePart.split('/');
  if (!day || !month || !year) return new Date('');

  const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}:00`;
  const parsedDate = new Date(isoString);

  return isNaN(parsedDate) ? new Date('') : parsedDate;
};

const validationSchemas = {
  deposito: Yup.object().shape({
  tipo: Yup.string().required('El tipo de depósito es requerido (ej: Propio, Tercerizado)'),
  horarios: Yup.object().shape({
  desde: Yup.string().required('Hora de apertura requerida'),
  hasta: Yup.string()
  .required('Hora de cierre requerida')
  .test(
    'is-after',
    'La hora de cierre debe ser posterior a la hora de apertura',
    function(value) {
      const { desde } = this.parent;
      if (!desde || !value) return true;
      const [fromH, fromM] = desde.split(':').map(Number);
      const [toH, toM] = value.split(':').map(Number);
      return (toH > fromH) || (toH === fromH && toM > fromM);
    }
  ),
}),
  direccion: Yup.string().required('La dirección es requerida (ej: Av. Corrientes 123)'),
  provincia: Yup.string().required('La provincia es requerida (ej: Buenos Aires)'),
  ciudad: Yup.string().required('La ciudad es requerida (ej: La Matanza)'),
  pais: Yup.string().required('El país es requerido (ej: Argentina)'),
  nombreContacto: Yup.string().required('El nombre de contacto es requerido (ej: Juan)'),
  apellidoContacto: Yup.string().required('El apellido de contacto es requerido (ej: Pérez)'),
  telefonoContacto: Yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]{10,15}$/, 'Teléfono inválido. Debe tener 10-15 dígitos (ej: 1123456789)')
}),

viaje: Yup.object().shape({
  depositoOrigen: Yup.object().required('Depósito origen es requerido'),
  depositoDestino: Yup.object().required('Depósito destino es requerido'),
  empresaTransportista: Yup.object().required('Empresa transportista es requerida'),
  choferAsignado: Yup.object().required('Chofer es requerido'),
  vehiculoAsignado: Yup.object().required('Vehículo es requerido'),
  tipoViaje: Yup.string().required('Tipo de viaje es requerido'),
  
  fechaInicio: Yup.string()
    .required('Fecha de inicio es requerida')
    .test('is-valid-date', 'Fecha inválida', value => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('is-future', 'Fecha de inicio no puede ser en el pasado', value => {
      if (!value) return false;
      return new Date(value) >= new Date();
    }),
    
  fechaFin: Yup.string()
    .required('Fecha de fin es requerida')
    .test('is-valid-date', 'Fecha inválida', value => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('is-after-start', 'Fecha fin debe ser posterior a fecha inicio', function(value) {
      const { fechaInicio } = this.parent;
      if (!fechaInicio || !value) return true;
      return new Date(value) > new Date(fechaInicio);
    })
    .test('min-duration', 'El viaje debe durar al menos 30 minutos', function(value) {
      const { fechaInicio } = this.parent;
      if (!fechaInicio || !value) return true;
      return (new Date(value) - new Date(fechaInicio)) >= 30 * 60 * 1000;
    })
}),


chofer: Yup.object().shape({
  nombre: Yup.string()
    .required('Requerido')
    .matches(/^[A-Za-zÁ-Úá-ú\s]+$/, 'Solo letras permitidas'),
  apellido: Yup.string()
    .required('Requerido')
    .matches(/^[A-Za-zÁ-Úá-ú\s]+$/, 'Solo letras permitidas'),
  cuil: Yup.string()
    .required('Requerido')
    .matches(/^[0-9]{11}$/, 'Debe tener 11 dígitos')
    .test('valid-cuil', 'CUIL inválido', value => {
      if (!value) return true;
      return value.length === 11;
    }),
  fechaNacimiento: Yup.date()
    .typeError('Fecha de nacimiento inválida')
    .required('Requerido')
    .max(new Date(), 'Fecha no puede ser futura')
    .test('valid-date', 'Fecha inválida', value => {
      if (!value) return false;
      return !isNaN(new Date(value).getTime());
    })
    .test('age', 'Debe tener al menos 18 años', value => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    })
    .transform((value, originalValue) => {
      // Transforma valores vacíos a undefined
      if (originalValue === '') return undefined;
      // Asegura que el valor sea una fecha válida
      const date = new Date(originalValue);
      return isNaN(date.getTime()) ? undefined : date;
    }),
  licenciaNumero: Yup.string()
    .required('Requerido')
    .matches(/^[A-Za-z0-9]+$/, 'Solo letras y números permitidos'),
  licenciaTipo: Yup.array()
    .min(1, 'Seleccione al menos un tipo')
    .max(3, 'Máximo 3 tipos permitidos'),
  licenciaExpiracion: Yup.date()
    .typeError('Fecha de expiración inválida')
    .required('Requerido')
    .min(new Date(), 'La licencia debe ser válida (fecha futura)')
    .test(
      'min-age',
      'La licencia debe tener al menos 6 meses de validez',
      value => {
        if (!value) return false;
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        return new Date(value) >= sixMonthsLater;
      }
    )
    .transform((value, originalValue) => {
      if (originalValue === '') return undefined;
      const date = new Date(originalValue);
      return isNaN(date.getTime()) ? undefined : date;
    }),
}),

vehiculo: Yup.object().shape({
  patente: Yup.string()
    .required('La patente es requerida')
    .matches(/^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/, 'Patente inválida. Formato: AA123BB o ABC123 (ej: AB123CD)'),
  tipoVehiculo: Yup.string().required('Seleccione el tipo de vehículo (ej: Camión, Furgón)'),
  marca: Yup.string().required('La marca es requerida (ej: Ford, Mercedes-Benz)'),
  modelo: Yup.string().required('El modelo es requerido (ej: F-150, Sprinter)'),
  año: Yup.number()
    .typeError('El año debe ser un número (ej: 2020)')
    .required('El año es requerido (ej: 2020)')
    .integer('El año debe ser un número entero')
    .min(1990, 'Año mínimo: 1990')
    .max(new Date().getFullYear(), 'Año no puede ser futuro')
    .transform((value, originalValue) => 
      originalValue === '' ? undefined : Number(value)
    ),
  volumen: Yup.number()
    .typeError('El volumen debe ser un número (ej: 50)')
    .required('El volumen es requerido en m³ (ej: 50)')
    .min(0, 'El volumen no puede ser negativo')
    .transform((value, originalValue) => 
      originalValue === '' ? undefined : Number(value)
    ),
  peso: Yup.number()
    .typeError('El peso debe ser un número (ej: 3000)')
    .required('El peso es requerido en kg (ej: 3000)')
    .min(0, 'El peso no puede ser negativo')
    .transform((value, originalValue) => 
      originalValue === '' ? undefined : Number(value)
    ),
}),

empresa: Yup.object().shape({
  nombre_empresa: Yup.string().required('La razón social es requerida (ej: Transportes del Sur S.A.)'),
  cuit: Yup.string()
    .required('El CUIT es requerido')
    .matches(/^\d{10,11}$/, 'Formato inválido. Debe ser XXXXXXXXXXX (ej: 30123456789)'),
  datos_contacto: Yup.object().shape({
    mail: Yup.string()
      .email('Ingrese un email válido')
      .required('El email es requerido'),
    telefono: Yup.string()
      .required('El teléfono es requerido')
      .matches(/^[0-9]{10,15}$/, 'Teléfono inválido. Debe tener 10-15 dígitos (ej: 1123456789)')
  }).required('Los datos de contacto son requeridos'),
  domicilio_fiscal: Yup.object().shape({
    direccion: Yup.string().required('La dirección es requerida (ej: Av. Libertador)'),
    ciudad: Yup.string().required('La ciudad es requerida (ej: Buenos Aires)'),
    provincia_estado: Yup.string().required('La Provincia/Estado es requerida (ej: Buenos Aires)'),
    pais: Yup.string().required('El país es requerido (ej: Argentina)')
  }).required('El domicilio fiscal es requerido')
}),

  default: Yup.object().shape({
    razonSocial: Yup.string().required('La razón social es requerida (ej: Transportes del Sur S.A.)'),
    cuit: Yup.string()
      .required('El CUIT es requerido')
      .matches(/^\d{10,11}$/, 'Formato inválido. Debe ser XXXXXXXXXXX (ej: 30123456789)'),
    domicilio: Yup.string().required('El domicilio es requerido (ej: Av. Libertador 1234)'),
    telefono: Yup.string()
      .required('El teléfono es requerido')
      .matches(/^[0-9]{10,15}$/, 'Teléfono inválido. Debe tener 10-15 dígitos (ej: 1123456789)')
  })
};

export default validationSchemas;