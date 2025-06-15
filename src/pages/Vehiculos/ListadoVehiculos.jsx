import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllVehiculos } from '../../services/Vehiculos/VehiculoService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';

export function ListadoVehiculos(){

  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  //Content state
  const [vehiculos, setVehiculos] = useState([]);

  //Componente filtro
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: '',
  });
  
  //API Call
  useEffect(() => {
    async function fetchVehiculos() {
      try {
        const vehiculos = await getAllVehiculos();
        setVehiculos(vehiculos);
      } catch (error) {
        console.log('ERROR FETCH API [vehiculos]: ' + error);
      }
    }
    fetchVehiculos();
  }, []);
  
  //Adding icons
  let listaCompleta = vehiculos;
  listaCompleta = listaCompleta.map(vehiculo => {
    return {
      ...vehiculo,
      empresa: `${vehiculo.empresa.nombre_empresa}`,
      capacidad: `${vehiculo.capacidad_carga.volumen}m³ - ${vehiculo.capacidad_carga.peso}kg`,
      modificar: <IconButton variant="tableButtons"><CreateOutlinedIcon variant="tableButtons"/></IconButton>,
      eliminar: <IconButton variant="tableButtons"><CloseOutlinedIcon variant="tableButtons"/></IconButton>,
    };
  });

  //Parametros para paginado
  const PaginaActual = (pagina) => {
    return listaCompleta.slice(
      (pagina - 1) * itemsPorPagina,
      pagina * itemsPorPagina
    );
  };

  // Columns configuration
  const columns = [
    { 
      id: 'patente', 
      label: 'Patente', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'marca', 
      label: 'Marca', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'modelo',
      label: 'Modelo',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'anio',
      label: 'Año',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'capacidad',
      label: 'Capacidad',
      sortable: false,
      minWidth: 50
    },
     {
      id: 'tipo_vehiculo',
      label: 'Tipo de vehiculo',
      sortable: false,
      minWidth: 50
    },
    {
      id: 'empresa',
      label: 'Empresa',
      sortable: false,
      minWidth: 50
    },
    {
      id: 'modificar',
      label: 'Modificar',
      sortable: false,
      minWidth: 50
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      minWidth: 50
    },
  ];

  // Sort handler
  const handleSort = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
    // Here you would typically call your API with new sort parameters
  };

  return <>
    <Box sx={{py:4, px:15}}>
      <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} mode={'vehiculos'}/>
      </Box>
      <Tabla2
        columns={columns}
        data={PaginaActual(pagina)}
        sortDirection={sortDirection}
        sortBy={sortBy}
        onSort={handleSort}
      />
      <Paginacion
        pagina={pagina}
        setPagina={setPagina}
        totalItems={listaCompleta.length}
        itemsPorPagina={itemsPorPagina}
        elemento="vehiculos"
      />
    </Box>   
  </>
};