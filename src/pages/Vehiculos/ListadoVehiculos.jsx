import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getActiveVehiculos,getVehiculoById,updateVehiculo,deleteVehiculo} from '../../services/Vehiculos/VehiculoService';

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
        const response = await getActiveVehiculos();
        const vehiculosActivos = response.filter(item => item.activo !== false);
        setVehiculosOriginales([...vehiculosActivos]);
        const datosTransformados = vehiculosActivos.map(item => ({
          ...item,
          _id: item._id,
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
    try {
      const vehiculoCompleto = await getVehiculoById(vehiculo._id);
      const empresaId = vehiculoCompleto.empresa?._id || vehiculoCompleto.empresa;
      const empresaNombre = vehiculoCompleto.empresa?.nombre_empresa || 'Sin empresa asignada';
      
      setSelectedVehiculo({
        ...vehiculoCompleto,
        tipoVehiculo: vehiculoCompleto.tipo_vehiculo,
        año: vehiculoCompleto.anio,
        volumen: vehiculoCompleto.capacidad_carga?.volumen,
        peso: vehiculoCompleto.capacidad_carga?.peso,
        empresa: empresaId,
        empresaNombre: empresaNombre
      });
      
      setPopupType(type);
      setPopupOpen(true);
    } catch (error) {
      console.error('Error al cargar datos del vehículo:', error);
      setError('No se pudieron cargar los datos completos del vehículo');
    }
  };

  const handleDeleteVehiculo = async (id) => {
    try {
      await deleteVehiculo(id);
      setVehiculos(prev => prev.filter(v => v._id !== id));
      setVehiculosFiltrados(prev => prev.filter(v => v._id !== id));
      setVehiculosOriginales(prev => prev.filter(v => v._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al desactivar vehículo:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al desactivar el vehículo',
        details: error.response?.data
      };
    }
  };

const columns = [
  { id: 'patente', label: 'Patente', width: 100 },
  { id: 'marca', label: 'Marca', width: 120 },
  { id: 'modelo', label: 'Modelo', width: 120 },
  { id: 'año', label: 'Año', width: 80 },
  { id: 'tipo_vehiculo', label: 'Tipo', width: 100 },
  { id: 'capacidad', label: 'Capacidad', width: 120 },
  { id: 'empresa', label: 'Empresa', width: 150 },
  {
    id: 'modificar',
    label: 'Modificar',
    width: 80,
    align: 'center',
    render: (_, row) => (
      <IconButton onClick={() => handleOpenPopup('modificar-vehiculo', row)} size="small" color="primary">
        <CreateOutlinedIcon fontSize="small"/>
      </IconButton>
    )
  },
  {
    id: 'eliminar',
    label: 'Eliminar',
    width: 80,
    align: 'center',
    render: (_, row) => (
      <IconButton onClick={() => handleOpenPopup('confirmar-eliminar', row)} size="small" color="error">
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
            "& .MuiTableCell-root": {
              padding: "12px 16px",
              fontSize: "0.875rem",
              textAlign: "center",
              fontWeight: 500
            },
            "& .MuiTableCell-head": {
              backgroundColor: "#062B60",
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "0.875rem"
            }
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

export { ListadoVehiculos };