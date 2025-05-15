import React, { useState } from 'react';

const TripTable = ({ filters, onFilterChange }) => {
  const trips = [
    {
      numero: 'PV-124', empresa: 'Transporte Sur', chofer: 'M. López', vehiculo: 'DEF456',
      fechaInicio: '2025-08-21', tipo: 'Internacional', origen: 'Mendoza', destino: 'Santiago'
    },
    {
      numero: 'PV-125', empresa: 'Cargas Norte', chofer: 'C. Gómez', vehiculo: 'GHI789',
      fechaInicio: '2025-08-22', tipo: 'Nacional', origen: 'Salta', destino: 'Rosario'
    },
    {
      numero: 'PV-126', empresa: 'Logística Andina', chofer: 'S. Martínez', vehiculo: 'JKL321',
      fechaInicio: '2025-08-23', tipo: 'Internacional', origen: 'San Juan', destino: 'Valparaíso'
    },
    {
      numero: 'PV-127', empresa: 'Ruta Federal', chofer: 'L. Fernández', vehiculo: 'MNO654',
      fechaInicio: '2025-08-24', tipo: 'Nacional', origen: 'La Plata', destino: 'M. del Plata'
    },
    {
      numero: 'PV-128', empresa: 'T. del Este', chofer: 'A. Ramírez', vehiculo: 'PQR987',
      fechaInicio: '2025-08-25', tipo: 'Nacional', origen: 'Santa Fe', destino: 'Paraná'
    },
    {
      numero: 'PV-129', empresa: 'Express Norte', chofer: 'J. Díaz', vehiculo: 'STU159',
      fechaInicio: '2025-08-26', tipo: 'Internacional', origen: 'Jujuy', destino: 'Tarija'
    },
    {
      numero: 'PV-130', empresa: 'Carga Patagónica', chofer: 'L. Torres', vehiculo: 'VWX753',
      fechaInicio: '2025-08-27', tipo: 'Nacional', origen: 'Neuquén', destino: 'Comodoro'
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const filteredTrips = trips.filter(trip => {
    const desdeMatch = filters.desde ? new Date(trip.fechaInicio) >= new Date(filters.desde) : true;
    const hastaMatch = filters.hasta ? new Date(trip.fechaInicio) <= new Date(filters.hasta) : true;
    const criterioMatch = filters.criterio ? trip[filters.criterio].toLowerCase().includes(filters.buscar.toLowerCase()) : true;
    return desdeMatch && hastaMatch && criterioMatch;
  });

  const totalTrips = filteredTrips.length;
  const tripsPerPage = parseInt(filters.cantidad, 10);
  const totalPages = Math.ceil(totalTrips / tripsPerPage);

  const displayedTrips = filteredTrips.slice((currentPage - 1) * tripsPerPage, currentPage * tripsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
          </tr>
        </thead>
        <tbody>
          {displayedTrips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.numero}</td>
              <td>{trip.empresa}</td>
              <td>{trip.chofer}</td>
              <td>{trip.vehiculo}</td>
              <td>{formatDate(trip.fechaInicio)}</td>
              <td>{trip.tipo}</td>
              <td>{trip.origen}</td>
              <td>{trip.destino}</td>
            </tr>
          ))}
          {displayedTrips.length < tripsPerPage && Array.from({ length: tripsPerPage - displayedTrips.length }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td colSpan="8">&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="data-quantity">
        <label>
          Cantidad de datos:
          <select name="cantidad" value={filters.cantidad} onChange={handleChange}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
      <div className="navigation">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>&lt; ANTERIOR</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>SIGUIENTE &gt;</button>
      </div>
    </div>
  );
};

export default TripTable;
