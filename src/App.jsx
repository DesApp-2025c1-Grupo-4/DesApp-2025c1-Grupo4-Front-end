import React, { useState } from 'react';
import Header from './components/Header';
import FilterSection from './components/FilterSection';
import TripTable from './components/TripTable';

const App = () => {
  const [filters, setFilters] = useState({
    desde: '',
    hasta: '',
    criterio: '',
    buscar: ''
  });

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  return (
    <div>
      <Header />
      <FilterSection filters={filters} onFilterChange={handleFilterChange} />
      <TripTable filters={filters} />
    </div>
  );
};

export default App;
