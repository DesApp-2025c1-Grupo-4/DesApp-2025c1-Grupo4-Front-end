import { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  CircularProgress,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Button,
  InputAdornment,
  Chip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { grey, blue } from "@mui/material/colors";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Tabla2 from "../../commonComponents/Tabla2";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import GridOnIcon from '@mui/icons-material/GridOn';

// Definición de estados de viaje
const ESTADOS_VIAJE = [
  { value: "planificado", label: "Planificado", color: "default" },
  { value: "en transito", label: "En tránsito", color: "primary" },
  { value: "completado", label: "Completado", color: "success" },
  { value: "demorado", label: "Demorado", color: "warning" },
  { value: "incidente", label: "Incidente", color: "error" },
  { value: "cancelado", label: "Cancelado", color: "error" }
];

const ListadoReportes = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [viajes, setViajes] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const [loading, setLoading] = useState({
    viajes: true,
    choferes: true,
    vehiculos: true,
    empresas: true,
    depositos: true
  });
  const [filtros, setFiltros] = useState({
    fechaDesde: null,
    fechaHasta: null,
    busqueda: "",
    diasFuturos: 7,
    empresaId: "",
    choferId: "",
    vehiculoId: "",
    estado: "",
    depositoOrigenId: "",
    depositoDestinoId: "",
  });

  // Función para parsear fechas del formato DD/MM/YYYY HH:MM
  const parseFecha = (fechaStr) => {
    if (!fechaStr) return null;
    try {
      const [date, time] = fechaStr.split(' ');
      const [day, month, year] = date.split('/');
      const [hours, minutes] = time.split(':');
      return new Date(year, month - 1, day, hours, minutes);
    } catch (error) {
      console.error("Error al parsear fecha:", fechaStr, error);
      return null;
    }
  };

  // Función para formatear fechas
  const formatFecha = (fechaStr) => {
    const fecha = parseFecha(fechaStr);
    return fecha ? fecha.toLocaleDateString("es-AR") + ' ' + fecha.toLocaleTimeString("es-AR", {hour: '2-digit', minute:'2-digit'}) : "N/A";
  };

  // Función auxiliar para normalizar IDs
  const normalizeId = (idOrObj) => {
    if (!idOrObj) return null;
    if (typeof idOrObj === 'string') return idOrObj;
    if (idOrObj._id) return idOrObj._id.toString();
    return null;
  };

  // Obtener vehículos asignados a un chofer específico
  const getVehiculosByChofer = (choferId) => {
    if (!choferId) return vehiculos;
    const chofer = choferes.find(c => normalizeId(c._id) === choferId);
    if (chofer?.vehiculo_defecto) {
      return vehiculos.filter(v => normalizeId(v._id) === normalizeId(chofer.vehiculo_defecto));
    }
    return []; 
  };


  // Obtener choferes asignados a un vehículo específico
  const getChoferesByVehiculo = (vehiculoId) => {
    if (!vehiculoId) return choferes;
    return choferes.filter(c => c.vehiculos_asignados?.some(va => normalizeId(va) === normalizeId(vehiculoId)));
  };

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({
          viajes: true,
          choferes: true,
          vehiculos: true,
          empresas: true,
          depositos: true
        });

        const [viajesRes, choferesRes, vehiculosRes, empresasRes, depositosRes] = await Promise.all([
          fetch("/api/viajes").then(res => res.json()),
          fetch("/api/choferes").then(res => res.json()),
          fetch("/api/vehiculos").then(res => res.json()),
          fetch("/api/empresas").then(res => res.json()),
          fetch("/api/depositos").then(res => res.json())
        ]);

        setViajes(viajesRes);
        setChoferes(choferesRes);
        setVehiculos(vehiculosRes);
        setEmpresas(empresasRes);
        setDepositos(depositosRes);
        
        setLoading({
          viajes: false,
          choferes: false,
          vehiculos: false,
          empresas: false,
          depositos: false
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading({
          viajes: false,
          choferes: false,
          vehiculos: false,
          empresas: false,
          depositos: false
        });
      }
    };

    fetchData();
  }, []);

  // Filter data based on active tab and filters
  const getFilteredData = () => {
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + parseInt(filtros.diasFuturos));

    switch (activeTab) {
      case 0: // Viajes programados
        return viajes.filter(viaje => {
          const fechaViaje = parseFecha(viaje.inicio_viaje);
          if (!fechaViaje) return false;
          
          const cumpleFechas = (
            (!filtros.fechaDesde || fechaViaje >= new Date(filtros.fechaDesde)) &&
            (!filtros.fechaHasta || fechaViaje <= new Date(filtros.fechaHasta))
          );
          
          const cumpleFiltrosEspecificos = (
            (!filtros.choferId || normalizeId(viaje.chofer_asignado) === filtros.choferId) &&
            (!filtros.vehiculoId || normalizeId(viaje.vehiculo_asignado) === filtros.vehiculoId) &&
            (!filtros.empresaId || normalizeId(viaje.empresa_asignada) === filtros.empresaId) &&
            (!filtros.estado || viaje.estado === filtros.estado) &&
            (!filtros.depositoOrigenId || normalizeId(viaje.deposito_origen) === filtros.depositoOrigenId) &&
            (!filtros.depositoDestinoId || normalizeId(viaje.deposito_destino) === filtros.depositoDestinoId) &&
            (!filtros.busqueda || 
              (viaje.chofer_asignado?.nombre + ' ' + viaje.chofer_asignado?.apellido || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              (viaje.vehiculo_asignado?.patente || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              (viaje.deposito_origen?.localizacion?.direccion || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              (viaje.deposito_destino?.localizacion?.direccion || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              (viaje.empresa_asignada?.nombre_empresa || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
          );
          
          return cumpleFechas && 
                 fechaViaje >= hoy && 
                 fechaViaje <= fechaLimite && 
                 cumpleFiltrosEspecificos;
        });

      case 1: // Vehículos en tránsito
        return viajes.filter(viaje => 
          viaje.estado === 'en transito' &&
          (!filtros.vehiculoId || normalizeId(viaje.vehiculo_asignado) === filtros.vehiculoId) &&
          (!filtros.busqueda || 
            (viaje.vehiculo_asignado?.patente || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            (viaje.chofer_asignado?.nombre + ' ' + viaje.chofer_asignado?.apellido || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      case 2: // Historial por empresa
        return viajes.filter(viaje => 
          (filtros.empresaId ? normalizeId(viaje.empresa_asignada) === filtros.empresaId : true) &&
          (!filtros.busqueda || 
            (viaje.empresa_asignada?.nombre_empresa || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            (viaje.vehiculo_asignado?.patente || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      case 3: // Historial por chofer
        return viajes.filter(viaje => 
          (filtros.choferId ? normalizeId(viaje.chofer_asignado) === filtros.choferId : true) &&
          (!filtros.busqueda || 
            (viaje.chofer_asignado?.nombre + ' ' + viaje.chofer_asignado?.apellido || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            (viaje.vehiculo_asignado?.patente || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      case 4: // Tiempos promedio
        const results = calculateAverageTimes();
        return filtros.busqueda 
          ? results.filter(item => 
              item.origen.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              item.destino.toLowerCase().includes(filtros.busqueda.toLowerCase()))
          : results;

      case 5: // Incidentes y demoras
        return viajes.filter(viaje => 
          (viaje.estado === 'incidente' || viaje.estado === 'demorado') &&
          (!filtros.empresaId || normalizeId(viaje.empresa_asignada) === filtros.empresaId) &&
          (!filtros.busqueda || 
            (viaje.vehiculo_asignado?.patente || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            (viaje.chofer_asignado?.nombre + ' ' + viaje.chofer_asignado?.apellido || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            (viaje.descripcion_incidente || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            (viaje.motivo_demora || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      default:
        return [];
    }
  };

  // Calculate average times between depots
  const calculateAverageTimes = () => {
    const depotPairs = {};
    
    viajes.forEach(viaje => {
      if (viaje.estado === 'completado' && viaje.deposito_origen && viaje.deposito_destino && viaje.inicio_viaje && viaje.fin_viaje) {
        const key = `${normalizeId(viaje.deposito_origen)}-${normalizeId(viaje.deposito_destino)}`;
        const start = parseFecha(viaje.inicio_viaje);
        const end = parseFecha(viaje.fin_viaje);
        
        if (start && end) {
          const duration = (end - start) / (1000 * 60 * 60); // in hours
          const origenNombre = viaje.deposito_origen?.localizacion?.direccion || 'Origen desconocido';
          const destinoNombre = viaje.deposito_destino?.localizacion?.direccion || 'Destino desconocido';
          
          if (!depotPairs[key]) {
            depotPairs[key] = {
              origen: origenNombre,
              destino: destinoNombre,
              count: 0,
              totalDuration: 0,
              min: Infinity,
              max: 0
            };
          }
          
          depotPairs[key].count++;
          depotPairs[key].totalDuration += duration;
          depotPairs[key].min = Math.min(depotPairs[key].min, duration);
          depotPairs[key].max = Math.max(depotPairs[key].max, duration);
        }
      }
    });

    return Object.keys(depotPairs).map(key => ({
      id: key,
      origen: depotPairs[key].origen,
      destino: depotPairs[key].destino,
      promedio: (depotPairs[key].totalDuration / depotPairs[key].count).toFixed(2),
      minimo: depotPairs[key].min.toFixed(2),
      maximo: depotPairs[key].max.toFixed(2),
      viajes: depotPairs[key].count
    }));
  };

  // Column configurations for different tabs
  const columnas = [
    // Tab 0: Viajes programados
    [
      { id: "inicio_viaje", label: "Fecha Inicio", minWidth: 120, render: (value) => formatFecha(value) },
      { id: "vehiculo_asignado", label: "Vehículo", minWidth: 100, render: (v) => v?.patente || "Sin asignar" },
      { id: "chofer_asignado", label: "Chofer", minWidth: 150, render: (c) => c ? `${c.nombre} ${c.apellido}` : "Sin asignar" },
      { id: "empresa_asignada", label: "Empresa", minWidth: 150, render: (e) => e?.nombre_empresa || "Sin asignar" },
      { 
        id: "deposito_origen", 
        label: "Origen", 
        minWidth: 150, 
        render: (d) => d?.localizacion?.direccion || "Sin dirección"
      },
      { 
        id: "deposito_destino", 
        label: "Destino", 
        minWidth: 150, 
        render: (d) => d?.localizacion?.direccion || "Sin dirección"
      },
      { 
        id: "estado", 
        label: "Estado", 
        minWidth: 100,
        render: (estado) => {
          const estadoObj = ESTADOS_VIAJE.find(e => e.value === estado) || { label: estado, color: "default" };
          return <Chip label={estadoObj.label} color={estadoObj.color} size="small" />;
        }
      },
    ],
    // Tab 1: Vehículos en tránsito
    [
      { id: "vehiculo_asignado", label: "Vehículo", minWidth: 100, render: (v) => v?.patente || "Sin asignar" },
      { id: "chofer_asignado", label: "Chofer", minWidth: 150, render: (c) => c ? `${c.nombre} ${c.apellido}` : "Sin asignar" },
      { id: "empresa_asignada", label: "Empresa", minWidth: 150, render: (e) => e?.nombre_empresa || "Sin asignar" },
      { id: "deposito_origen", label: "Origen", minWidth: 150, render: (d) => d?.localizacion?.direccion || "Sin dirección" },
      { id: "deposito_destino", label: "Destino", minWidth: 150, render: (d) => d?.localizacion?.direccion || "Sin dirección" },
      { id: "inicio_viaje", label: "Hora salida", minWidth: 120, render: (value) => formatFecha(value) },
      { 
        id: "tiempo_transcurrido", 
        label: "Tiempo", 
        minWidth: 80, 
        render: (_, row) => {
          const inicio = parseFecha(row.inicio_viaje);
          if (!inicio) return "N/A";
          const hours = Math.floor((new Date() - inicio) / (1000 * 60 * 60));
          return `${hours}h`;
        } 
      }
    ],
    // Tab 2: Historial por empresa
    [
      { id: "inicio_viaje", label: "Fecha Inicio", minWidth: 150, render: (value) => formatFecha(value) },
      { id: "vehiculo_asignado", label: "Vehículo", minWidth: 100, render: (v) => v?.patente || "Sin asignar" },
      { id: "chofer_asignado", label: "Chofer", minWidth: 150, render: (c) => c ? `${c.nombre} ${c.apellido}` : "Sin asignar" },
      { id: "deposito_origen", label: "Origen", minWidth: 150, render: (d) => d?.localizacion?.direccion || "Sin dirección" },
      { id: "deposito_destino", label: "Destino", minWidth: 150, render: (d) => d?.localizacion?.direccion || "Sin dirección" },
      { 
        id: "estado", 
        label: "Estado", 
        minWidth: 100,
        render: (estado) => {
          const estadoObj = ESTADOS_VIAJE.find(e => e.value === estado) || { label: estado, color: "default" };
          return <Chip label={estadoObj.label} color={estadoObj.color} size="small" />;
        }
      }
    ],
    // Tab 3: Historial por chofer
    [
      { id: "inicio_viaje", label: "Fecha Inicio", minWidth: 150, render: (value) => formatFecha(value) },
      { id: "vehiculo_asignado", label: "Vehículo", minWidth: 100, render: (v) => v?.patente || "Sin asignar" },
      { id: "empresa_asignada", label: "Empresa", minWidth: 150, render: (e) => e?.nombre_empresa || "Sin asignar" },
      { id: "deposito_origen", label: "Origen", minWidth: 150, render: (d) => d?.localizacion?.direccion || "Sin dirección" },
      { id: "deposito_destino", label: "Destino", minWidth: 150, render: (d) => d?.localizacion?.direccion || "Sin dirección" },
      { 
        id: "estado", 
        label: "Estado", 
        minWidth: 100,
        render: (estado) => {
          const estadoObj = ESTADOS_VIAJE.find(e => e.value === estado) || { label: estado, color: "default" };
          return <Chip label={estadoObj.label} color={estadoObj.color} size="small" />;
        }
      }
    ],
    // Tab 4: Tiempos promedio
    [
      { id: "origen", label: "Origen", minWidth: 150 },
      { id: "destino", label: "Destino", minWidth: 150 },
      { id: "promedio", label: "Tiempo promedio (h)", minWidth: 120 },
      { id: "minimo", label: "Mínimo (h)", minWidth: 100 },
      { id: "maximo", label: "Máximo (h)", minWidth: 100 },
      { id: "viajes", label: "Viajes", minWidth: 80 }
    ],
    // Tab 5: Incidentes y demoras
    [
      { id: "inicio_viaje", label: "Fecha", minWidth: 120, render: (value) => formatFecha(value) },
      { id: "vehiculo_asignado", label: "Vehículo", minWidth: 100, render: (v) => v?.patente || "Sin asignar" },
      { id: "chofer_asignado", label: "Chofer", minWidth: 150, render: (c) => c ? `${c.nombre} ${c.apellido}` : "Sin asignar" },
      { id: "empresa_asignada", label: "Empresa", minWidth: 150, render: (e) => e?.nombre_empresa || "Sin asignar" },
      { id: "deposito_origen", label: "Origen", minWidth: 150, render: (d) => d?.localizacion?.direccion || "Sin dirección" },
      { id: "deposito_destino", label: "Destino", minWidth: 150, render: (d) => d?.localizacion?.direccion || "Sin dirección" },
      { 
        id: "estado", 
        label: "Estado", 
        minWidth: 100,
        render: (estado) => {
          const estadoObj = ESTADOS_VIAJE.find(e => e.value === estado) || { label: estado, color: "default" };
          return <Chip label={estadoObj.label} color={estadoObj.color} size="small" />;
        }
      },
    ]
  ];

  const filteredData = getFilteredData();
  const isLoading = Object.values(loading).some(v => v);

  const limpiarFiltros = () => {
    setFiltros({
      fechaDesde: null,
      fechaHasta: null,
      busqueda: "",
      diasFuturos: 7,
      empresaId: "",
      choferId: "",
      vehiculoId: "",
      estado: "",
      depositoOrigenId: "",
      depositoDestinoId: "",
    });
  };

  const handleChoferChange = (choferId) => {
    const choferSeleccionado = choferes.find(c => normalizeId(c._id) === choferId);
    const vehiculoDefectoId = choferSeleccionado?.vehiculo_defecto 
      ? normalizeId(choferSeleccionado.vehiculo_defecto) 
      : "";

    setFiltros({
      ...filtros,
      choferId,
      vehiculoId: vehiculoDefectoId 
    });
  };

  const handleVehiculoChange = (vehiculoId) => {
    setFiltros({
      ...filtros,
      vehiculoId,
      choferId: ""
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 3}}>
        <Paper sx={{ mb: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              limpiarFiltros();
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                color: grey[700],
                '&.Mui-selected': {
                  color: '#062B60',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#F38F2B',
                height: 3
              }
            }}
          >
            <Tab label="Viajes programados" />
            <Tab label="Vehículos en tránsito" />
            <Tab label="Historial por empresa" />
            <Tab label="Historial por chofer" />
            <Tab label="Tiempos promedio" />
            <Tab label="Incidentes" />
          </Tabs>
        </Paper>

        <Paper sx={{ p: 2, mb: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Buscar"
                value={filtros.busqueda}
                onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: filtros.busqueda && (
                    <InputAdornment position="end">
                      <ClearIcon 
                        onClick={() => setFiltros({...filtros, busqueda: ""})}
                        style={{ cursor: 'pointer', color: grey[500] }}
                      />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': { borderColor: grey[300] },
                  },
                }}
              />
            </Grid>

            {activeTab === 0 && (
              <>
                <Grid item xs={12} sm={4} md={2}>
                  <TextField
                    fullWidth
                    label="Próximos días"
                    type="number"
                    size="small"
                    value={filtros.diasFuturos}
                    onChange={(e) => setFiltros({...filtros, diasFuturos: Math.max(1, Number(e.target.value))})}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { borderColor: grey[300] },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontWeight: 'bold', marginTop: '-16px',}}>Chofer</InputLabel>
                    <Select
                      value={filtros.choferId}
                      label="Chofer"
                      onChange={(e) => handleChoferChange(e.target.value)}
                      sx={{
                        borderRadius: '8px',
                        marginTop: '-16px',
                        '& fieldset': { borderColor: grey[300] },
                      }}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {choferes?.map(chofer => (
                        <MenuItem key={chofer._id} value={chofer._id}>
                          {`${chofer.nombre || ''} ${chofer.apellido || ''}`.trim() || 'Chofer sin nombre'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ marginTop: '-16px',fontWeight: 'bold' }}>Vehículo</InputLabel>
                    <Select
                      value={filtros.vehiculoId}
                      label="Vehículo"
                      onChange={(e) => setFiltros({...filtros, vehiculoId: e.target.value})}
                      sx={{
                        borderRadius: '8px',
                        marginTop: '-16px',
                        '& fieldset': { borderColor: grey[300] },
                      }}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {getVehiculosByChofer(filtros.choferId)?.map(vehiculo => (
                        <MenuItem key={vehiculo._id} value={vehiculo._id}>
                          {vehiculo.patente || 'Sin patente'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {activeTab === 2 && (
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontWeight: 'bold',marginTop: '-16px', }}>Empresa</InputLabel>
                  <Select
                    value={filtros.empresaId}
                    label="Empresa"
                    onChange={(e) => setFiltros({...filtros, empresaId: e.target.value})}
                    sx={{
                      borderRadius: '8px',
                      marginTop: '-16px',
                      '& fieldset': { borderColor: grey[300] },
                    }}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {empresas?.map(empresa => (
                      <MenuItem key={empresa._id} value={empresa._id}>
                        {empresa.nombre_empresa || 'Empresa sin nombre'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {activeTab === 3 && (
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ marginTop: '-16px',fontWeight: 'bold' }}>Chofer</InputLabel>
                  <Select
                    value={filtros.choferId}
                    label="Chofer"
                    onChange={(e) => setFiltros({...filtros, choferId: e.target.value})}
                    sx={{
                      borderRadius: '8px',
                      marginTop: '-16px',
                      '& fieldset': { borderColor: grey[300] },
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {choferes?.map(chofer => (
                      <MenuItem key={chofer._id} value={chofer._id}>
                        {`${chofer.nombre || ''} ${chofer.apellido || ''}`.trim() || 'Chofer sin nombre'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {(activeTab === 2 || activeTab === 3 || activeTab === 5) && (
              <>
                <Grid item xs={6} sm={4} md={2} sx={{ pt: 0 }}>
                  <DatePicker
                    label="Desde"
                    value={filtros.fechaDesde}
                    onChange={(newValue) => setFiltros({...filtros, fechaDesde: newValue})}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': { borderColor: grey[300] },
                          },
                        }
                      } 
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2} sx={{ pt: 0 }}>
                  <DatePicker
                    label="Hasta"
                    value={filtros.fechaHasta}
                    onChange={(newValue) => setFiltros({...filtros, fechaHasta: newValue})}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        size: 'small',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            marginTop: '-16px',
                            '& fieldset': { borderColor: grey[300] },
                          },
                        }
                      } 
                    }}
                    minDate={filtros.fechaDesde}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={6} sm={3} md={1.2}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={limpiarFiltros}
                sx={{
                  height: '40px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  marginTop: '-20px',
                }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress color="primary" />
          </Box>
        ) : filteredData.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              No hay datos para mostrar con los filtros seleccionados
            </Typography>
          </Box>
        ) : (
          <Tabla2 
            columns={columnas[activeTab]} 
            data={filteredData}
            sx={{
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
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default ListadoReportes;