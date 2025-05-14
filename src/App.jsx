import React, { useState } from 'react';
import Header from './components/ListadoDeViajes/HeaderListadoDeViajes';
import FilterSection from './components/ListadoDeViajes/FilterSection';
import TripTable from './components/ListadoDeViajes/TripTable';
import './index.css'; 

const App = () => {
  const [filters, setFilters] = useState({
    desde: '',
    hasta: '',
    criterio: '',
    buscar: '',
    cantidad: '10'
  });

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  return (
    <div className="app">
      <Header />
      <FilterSection filters={filters} onFilterChange={handleFilterChange} />
      <TripTable filters={filters} onFilterChange={handleFilterChange} />
    </div>
  );
};

export default App;
