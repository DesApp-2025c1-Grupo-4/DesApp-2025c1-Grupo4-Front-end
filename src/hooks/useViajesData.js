import { useState, useEffect } from 'react';
import { getViajes } from '../services/Viajes/ViajeServices';

export const useViajesData = () => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTipoViaje = (origen, destino) => {
    if (!origen || !destino) return 'No especificado';
    const paisOrigen = origen.split(',').pop()?.trim().toLowerCase();
    const paisDestino = destino.split(',').pop()?.trim().toLowerCase();
    return paisOrigen === 'argentina' && paisDestino === 'argentina' ? 'Nacional' : 'Internacional';
  };

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const data = await getViajes({});
        const viajesFormateados = data.map(viaje => {
          const origen = viaje.deposito_origen?.localizacion 
            ? `${viaje.deposito_origen.localizacion.provincia_estado}, ${viaje.deposito_origen.localizacion.pais}`
            : 'No especificado';
            
          const destino = viaje.deposito_destino?.localizacion
            ? `${viaje.deposito_destino.localizacion.provincia_estado}, ${viaje.deposito_destino.localizacion.pais}`
            : 'No especificado';
            
          return {
            ...viaje,
            numeroViaje: `${viaje._id}`,
            empresaTransportista: viaje.empresa_asignada?.nombre_empresa || 'No especificada',
            nombreChofer: viaje.chofer_asignado
              ? `${viaje.chofer_asignado.nombre} ${viaje.chofer_asignado.apellido}`
              : 'No asignado',
            patenteVehiculo: viaje.vehiculo_asignado?.patente || '----',
            fechaFormateada: viaje.inicio_viaje,
            origen,
            destino,
            tipoViaje: getTipoViaje(origen, destino)
          };
        });
        
        setViajes(viajesFormateados);
      } catch (err) {
        setError('Error al cargar viajes. Intenta nuevamente.');
        console.error("Error detallado:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchViajes();
  }, []);

  return { viajes, loading, error };
};