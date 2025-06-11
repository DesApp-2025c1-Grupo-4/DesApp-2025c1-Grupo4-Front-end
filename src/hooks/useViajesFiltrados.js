import { useState, useEffect } from 'react';

export const useViajesFiltrados = (viajes, filtros) => {
  const [viajesFiltrados, setViajesFiltrados] = useState([]);
  const itemsPorPagina = 10;

  useEffect(() => {
    if (viajes.length > 0) {
      const resultados = viajes.filter(viaje => {
        if (filtros.fechaDesde && new Date(viaje.inicioViaje) < new Date(filtros.fechaDesde)) return false;
        if (filtros.fechaHasta && new Date(viaje.inicioViaje) > new Date(filtros.fechaHasta)) return false;
        
        if (filtros.busqueda) {
          const term = filtros.busqueda.toLowerCase().trim();
          if (filtros.criterio === 'Tipo de viaje') {
            return viaje.tipoViaje.toLowerCase() === term;
          }
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
        return true;
      });
      setViajesFiltrados(resultados);
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