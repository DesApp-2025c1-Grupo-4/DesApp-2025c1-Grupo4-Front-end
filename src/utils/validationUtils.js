export const getValidationSchema = (page) => {
  if (page.includes('deposito')) return depositoSchema;
  if (page.includes('viaje')) return viajeSchema;
  if (page.includes('chofer')) return choferSchema;
  if (page.includes('vehiculo')) return vehiculoSchema;
  return empresaSchema;
};

export const validateField = async (schema, field, value) => {
  try {
    await schema.validateAt(field, { [field]: value });
    return '';
  } catch (error) {
    return error.message;
  }
};