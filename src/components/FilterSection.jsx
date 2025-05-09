import React from 'react';

const FilterSection = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="filter-section">
      <div className="filters">
        <label>
          Desde (Fecha):
          <input type="date" name="desde" value={filters.desde} onChange={handleChange} />
        </label>
        <label>
          Hasta (Fecha):
          <input type="date" name="hasta" value={filters.hasta} onChange={handleChange} />
        </label>
        <label>
          Criterio de filtrado:
          <select name="criterio" value={filters.criterio} onChange={handleChange}>
            <option value="">Seleccionar</option>
            <option value="empresa">Empresa transportista</option>
            <option value="chofer">Chofer</option>
            <option value="vehiculo">Vehículo</option>
            <option value="tipo">Tipo de viaje</option>
          </select>
        </label>
        <label>
          Buscar:
          <input type="text" name="buscar" value={filters.buscar} onChange={handleChange} placeholder="Buscar..." />
        </label>
        <button onClick={() => console.log(filters)}>BUSCAR</button>
      </div>
    </div>
  );
};

export default FilterSection;
