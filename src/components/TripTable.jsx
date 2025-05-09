import React from 'react';

const TripTable = ({ filters }) => {
  const trips = [
    {
      numero: 'PV-123',
      empresa: 'El Aguila',
      chofer: 'Carlos Sosa',
      vehiculo: 'ABC123',
      fechaInicio: '2025-08-20',
      tipo: 'Nacional',
      origen: 'Buenos Aires',
      destino: 'Cordoba',
      detalle: 'Detalle del viaje'
    }
  ];

  const filteredTrips = trips.filter(trip => {
    const desdeMatch = filters.desde ? new Date(trip.fechaInicio) >= new Date(filters.desde) : true;
    const hastaMatch = filters.hasta ? new Date(trip.fechaInicio) <= new Date(filters.hasta) : true;
    const criterioMatch = filters.criterio ? trip[filters.criterio].toLowerCase().includes(filters.buscar.toLowerCase()) : true;
    return desdeMatch && hastaMatch && criterioMatch;
  });

  return (
    <div className="trip-table">
      <table>
        <thead>
          <tr>
            <th>Numero de viaje</th>
            <th>Empresa transportista</th>
            <th>Chofer</th>
            <th>Vehiculo</th>
            <th>Fecha inicio</th>
            <th>Tipo de viaje</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.numero}</td>
              <td>{trip.empresa}</td>
              <td>{trip.chofer}</td>
              <td>{trip.vehiculo}</td>
              <td>{trip.fechaInicio}</td>
              <td>{trip.tipo}</td>
              <td>{trip.origen}</td>
              <td>{trip.destino}</td>
              <td>{trip.detalle}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="navigation">
        <button>&lt; ANTERIOR</button>
        <button>SIGUIENTE &gt;</button>
      </div>
    </div>
  );
};

export default TripTable;
