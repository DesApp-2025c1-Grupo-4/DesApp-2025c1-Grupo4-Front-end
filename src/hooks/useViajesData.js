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
          const origen = viaje.depositoOrigen?.localizacion 
            ? `${viaje.depositoOrigen.localizacion.provinciaOestado}, ${viaje.depositoOrigen.localizacion.país}`
            : 'No especificado';
            
          const destino = viaje.depositoDestino?.localizacion
            ? `${viaje.depositoDestino.localizacion.provinciaOestado}, ${viaje.depositoDestino.localizacion.país}`
            : 'No especificado';
            
          return {
            ...viaje,
            numeroViaje: `PV - ${viaje._id}`,
            empresaTransportista: viaje.asignacion?.chofer?.empresa?.razonSocial || 'No especificada',
            nombreChofer: viaje.asignacion?.chofer 
              ? `${viaje.asignacion.chofer.nombre} ${viaje.asignacion.chofer.apellido}`
              : 'No asignado',
            patenteVehiculo: viaje.asignacion?.vehiculo?.patente || '----',
            fechaFormateada: viaje.inicioViaje 
              ? new Date(viaje.inicioViaje).toLocaleDateString('es-AR')
              : '----',
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