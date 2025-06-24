import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';

const ListadoVehiculos = () => {
  const [filtros, setFiltros] = useState({
    criterio: 'Patente',
    busqueda: ''
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    criterio: 'Patente',
    busqueda: ''
  });
  const [pagina, setPagina] = useState(1);
  const [itemsPorPagina] = useState(10);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosOriginales, setVehiculosOriginales] = useState([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await axios.get('/api/vehiculos');
        // Filtrar solo vehículos activos
        const vehiculosActivos = response.data.filter(item => item.activo !== false);
        
        setVehiculosOriginales([...vehiculosActivos]);
        const datosTransformados = vehiculosActivos.map(item => ({
          ...item,
          _id: item._id, // Asegúrate de incluir esto
          empresa: item.empresa?.nombre_empresa || 'Sin empresa',
          capacidad: `${item.capacidad_carga?.volumen || 0}m³ - ${item.capacidad_carga?.peso || 0}kg`,
          año: item.anio,
          tipo_vehiculo: item.tipo_vehiculo,
          capacidad_carga: item.capacidad_carga,
          anio: item.anio
        }));

        setVehiculos(datosTransformados);
        setVehiculosFiltrados(datosTransformados);
      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
        console.error('Error fetching vehiculos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, []);

  useEffect(() => {
    const filtered = vehiculos.filter(vehiculo => {
      if (filtrosAplicados.busqueda) {
        const searchTerm = filtrosAplicados.busqueda.toLowerCase();
        switch (filtrosAplicados.criterio) {
          case 'Patente':
            return (vehiculo.patente || '').toLowerCase().includes(searchTerm);
          case 'Marca':
            return (vehiculo.marca || '').toLowerCase().includes(searchTerm);
          case 'Modelo':
            return (vehiculo.modelo || '').toLowerCase().includes(searchTerm);
          case 'Empresa':
            return (vehiculo.empresa || '').toLowerCase().includes(searchTerm);
          default:
            return true;
        }
      }
      return true;
    });
    setVehiculosFiltrados(filtered);
    setPagina(1);
  }, [filtrosAplicados, vehiculos]);

  const aplicarFiltros = () => {
    setFiltrosAplicados({ ...filtros });
  };

  const limpiarFiltros = () => {
    setFiltros({
      criterio: 'Patente',
      busqueda: ''
    });
    setFiltrosAplicados({
      criterio: 'Patente',
      busqueda: ''
    });
  };

  const vehiculosPaginaActual = () => {
    const inicio = (pagina - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return vehiculosFiltrados.slice(inicio, fin);
  };

  const handleOpenPopup = async (type, vehiculo) => {
    setSelectedVehiculo({
      ...vehiculo,
      tipoVehiculo: vehiculo.tipo_vehiculo,
      año: vehiculo.anio,
      volumen: vehiculo.capacidad_carga?.volumen,
      peso: vehiculo.capacidad_carga?.peso,
      empresa: vehiculo.empresa?._id || vehiculo.empresa,
      empresaNombre: vehiculo.empresa?.nombre_empresa || vehiculo.empresa || 'Sin empresa asignada',
      empresaObj: vehiculo.empresa || null
    });
    setPopupType(type);
    setPopupOpen(true);
  };

const handleDeleteVehiculo = async (id) => {
  try {
    const { data: currentData } = await axios.get(`/api/vehiculos/${id}`);
    const empresaId = typeof currentData.empresa === 'object' 
      ? currentData.empresa._id 
      : currentData.empresa;

    const dataToSend = {
      patente: currentData.patente,
      tipo_vehiculo: currentData.tipo_vehiculo,
      marca: currentData.marca,
      modelo: currentData.modelo,
      anio: currentData.anio,
      capacidad_carga: {
        volumen: currentData.capacidad_carga?.volumen || 0,
        peso: currentData.capacidad_carga?.peso || 0
      },
      empresa: empresaId,
      activo: false
    };

    await axios.put(`/api/vehiculos/${id}`, dataToSend);
    setVehiculos(prev => prev.filter(v => v._id !== id));
    setVehiculosFiltrados(prev => prev.filter(v => v._id !== id));
    setVehiculosOriginales(prev => prev.filter(v => v._id !== id));
    return { success: true };
  } catch (error) {
    console.error('Error al desactivar vehículo:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al desactivar el vehículo',
      details: error.response?.data
    };
  }
};

  const columns = [
    { 
      id: 'patente',
      label: 'Patente',
      minWidth: 100,
      align: 'left'
    },
    { 
      id: 'marca', 
      label: 'Marca', 
      minWidth: 120,
      align: 'left'
    },
    {
      id: 'modelo',
      label: 'Modelo',
      minWidth: 120,
      align: 'left'
    },
    {
      id: 'año',
      label: 'Año',
      minWidth: 80,
      align: 'left'
    },
    {
      id: 'tipo_vehiculo',
      label: 'Tipo',
      minWidth: 100,
      align: 'left'
    },
    {
      id: 'capacidad',
      label: 'Capacidad',
      minWidth: 120,
      align: 'left'
    },
    {
      id: 'empresa',
      label: 'Empresa',
      minWidth: 150,
      align: 'left'
    },
    {
      id: 'modificar',
      label: 'Modificar',
      minWidth: 80,
      align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-vehiculo', row)}
          size="small"
          color="primary"
        >
          <CreateOutlinedIcon fontSize="small"/>
        </IconButton>
      )
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      minWidth: 80,
      align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('confirmar-eliminar', row)}
          size="small"
          color="error"
        >
          <CloseOutlinedIcon fontSize="small"/>
        </IconButton>
      )
    }
  ];

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Popup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        page={popupType}
        selectedItem={selectedVehiculo}
        onDelete={popupType === 'confirmar-eliminar' ? handleDeleteVehiculo : null}
      />

      <Box mb={4}>
        <Filtro 
          filtros={filtros} 
          setFiltros={setFiltros} 
          mode="vehiculos"
          onSearch={aplicarFiltros}
          onClear={limpiarFiltros}
        />
      </Box>
      
      <Box sx={{
        width: '85vw',
        marginLeft: 'calc(-43vw + 50%)',
        marginRight: 'calc(-40vw + 50%)',
        overflowX: 'hidden'
      }}>
        <Tabla2
          columns={columns}
          data={vehiculosPaginaActual()}
          sx={{
            tableLayout: 'auto',
            width: '100%',
          }}
        />
      </Box>
            
      <Paginacion
        pagina={pagina}
        setPagina={setPagina}
        totalItems={vehiculosFiltrados.length}
        itemsPorPagina={itemsPorPagina}
        elemento="vehículos"
      />
    </Container>
  );
};

export {ListadoVehiculos};