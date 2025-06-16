import { useState, useEffect } from 'react';

export const useViajesFiltrados = (viajes, filtros) => {
  const [viajesFiltrados, setViajesFiltrados] = useState([]);
  const itemsPorPagina = 10;

  useEffect(() => {
    if (viajes.length > 0) {
      // Ordenar por fecha de inicio del viaje (ascendente)
      const viajesOrdenados = [...viajes].sort((a, b) => {
        return new Date(a.inicioViaje) - new Date(b.inicioViaje);
      });

      const resultados = viajesOrdenados.filter(viaje => {
        // Filtrar por fechas
        if (filtros.fechaDesde && new Date(viaje.inicioViaje) < new Date(filtros.fechaDesde)) return false;
        if (filtros.fechaHasta && new Date(viaje.inicioViaje) > new Date(filtros.fechaHasta)) return false;
        
        // Filtrar por criterio de búsqueda si existe
        if (filtros.busqueda) {
          const term = filtros.busqueda.toLowerCase().trim();
          
          // Búsqueda específica por criterio seleccionado
          switch(filtros.criterio) {
            case 'Empresa transportista':
              return (viaje.empresaTransportista || '').toLowerCase().includes(term);
            case 'Chofer':
              return (viaje.nombreChofer || '').toLowerCase().includes(term);
            case 'Vehículo':
              return (viaje.patenteVehiculo || '').toLowerCase().includes(term);
            case 'Tipo de viaje':
              return (viaje.tipoViaje || '').toLowerCase().includes(term);
            case 'Origen':
              return (viaje.origen || '').toLowerCase().includes(term);
            case 'Destino':
              return (viaje.destino || '').toLowerCase().includes(term);
            default:
              // Búsqueda general si no hay criterio específico
              return (
                viaje._id.toString().toLowerCase().includes(term) ||
                (viaje.empresaTransportista || '').toLowerCase().includes(term) ||
                (viaje.nombreChofer || '').toLowerCase().includes(term) ||
                (viaje.patenteVehiculo || '').toLowerCase().includes(term) ||
                (viaje.estado || '').toLowerCase().includes(term) ||
                (viaje.origen || '').toLowerCase().includes(term) ||
                (viaje.destino || '').toLowerCase().includes(term)
              );
          }
        }
        return true;
      });

      setViajesFiltrados(resultados);
    } else {
      setViajesFiltrados([]);
    }
  }, [viajes, filtros]);

  const viajesPaginaActual = (pagina) => {
    return viajesFiltrados.slice(
      (pagina - 1) * itemsPorPagina,
      pagina * itemsPorPagina
    );
  };

  return { viajesFiltrados, viajesPaginaActual, itemsPorPagina };
};