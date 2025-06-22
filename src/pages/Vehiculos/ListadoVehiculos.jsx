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
        setVehiculosOriginales([...response.data]);
        const datosTransformados = response.data.map(item => ({
          ...item,
          empresa: item.empresa?.nombre_empresa || 'Sin empresa',
          capacidad: `${item.capacidad_carga?.volumen || 0}m³ - ${item.capacidad_carga?.peso || 0}kg`,
          año: item.anio, // Para mostrar en tabla
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
  setSelectedVehiculo(null);
  try {
    if (!vehiculo._id) throw new Error('Vehículo sin _id');
    const response = await axios.get(`/api/vehiculos/${vehiculo._id}`);
    const data = response.data;

    setSelectedVehiculo({
      patente: data.patente,
      marca: data.marca,
      modelo: data.modelo,
      tipoVehiculo: data.tipo_vehiculo,
      año: data.anio,
      volumen: data.capacidad_carga?.volumen,
      peso: data.capacidad_carga?.peso,
      empresa: data.empresa ? {
        _id: data.empresa._id,
        nombre_empresa: data.empresa.nombre_empresa
      } : null
    });
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    setSelectedVehiculo({
      ...vehiculo,
      tipoVehiculo: vehiculo.tipo_vehiculo,
      año: vehiculo.anio,
      volumen: vehiculo.capacidad_carga?.volumen,
      peso: vehiculo.capacidad_carga?.peso,
      empresa: vehiculo.empresaObj ? {
        _id: vehiculo.empresaObj._id,
        nombre_empresa: vehiculo.empresaObj.nombre_empresa
      } : null
    });
  }
  setPopupType(type);
  setPopupOpen(true);
};


  const handleDeleteVehiculo = async (patente) => {
    try {
      await axios.patch(`/api/vehiculos/${patente}/delete`);
      setVehiculos(prev => prev.filter(v => v.patente !== patente));
      setVehiculosFiltrados(prev => prev.filter(v => v.patente !== patente));
      setVehiculosOriginales(prev => prev.filter(v => v.patente !== patente));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      return { success: false, error: error.message };
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
        buttonName={
          popupType === 'modificar-vehiculo' ? 'Modificar Vehículo' : 
          popupType === 'confirmar-eliminar' ? 'Eliminar Vehículo' : 
          'Aceptar'
        }
        message={popupType === 'confirmar-eliminar' ? '¿Está seguro que desea eliminar este vehículo?' : ''}
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