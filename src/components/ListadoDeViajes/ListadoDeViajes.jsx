// ListadoDeViajes.jsx
import React, { useState } from 'react';
import Header from '../Header';
import FilterSection from './FilterSection';
import TripTable from './TripTable';

const ListadoDeViajes = () => {
  const [filters, setFilters] = useState({
    desde: '',
    hasta: '',
    criterio: '',
    buscar: '',
    cantidad: '10'
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header title="Listado de Viajes" />
      <FilterSection filters={filters} onFilterChange={handleFilterChange} />
      <TripTable filters={filters} onFilterChange={handleFilterChange} />
    </>
  );
};

export default ListadoDeViajes;
