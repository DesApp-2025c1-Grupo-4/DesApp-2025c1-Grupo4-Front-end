import * as Yup from 'yup';

const parseCustomDate = (value, originalValue) => {
  if (value instanceof Date && !isNaN(value)) return value;

  if (typeof originalValue !== 'string') return new Date(''); // inválido

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
  )
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
    fechaInicio: Yup.date()
      .transform(parseCustomDate)
      .required('Fecha de inicio es requerida'),

    fechaFin: Yup.date()
      .nullable()
      .transform(parseCustomDate)
      .min(Yup.ref('fechaInicio'), 'Fecha fin no puede ser anterior a fecha inicio'),

    tipoViaje: Yup.string().required('Tipo de viaje es requerido'),
  }),


  chofer: Yup.object().shape({
  nombre: Yup.string().required('Requerido'),
  apellido: Yup.string().required('Requerido'),
  cuil: Yup.string().required('Requerido'),
  fechaNacimiento: Yup.date().required('Requerido'),
  licenciaNumero: Yup.string().required('Requerido'),
  licenciaTipo: Yup.array().min(1, 'Seleccione al menos un tipo'),
  licenciaExpiracion: Yup.date().required('Requerido')
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
    }),
    domicilio_fiscal: Yup.object().shape({
      direccion: Yup.string().required('La direccion es requerida (ej: Av. Libertador)'),
      ciudad: Yup.string().required('La ciudad es requerida (ej: Buenos Aires)'),
      provincia_estado: Yup.string().required('La Provincia/Estado es requerida (ej: Buenos Aires)'),
      pais: Yup.string().required('El país es requerido (ej: Argentina)')
    })
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