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
  InputAdornment
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Tabla2 from "../../commonComponents/Tabla2";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export function ListadoReportes() {
  const [activeTab, setActiveTab] = useState(0);
  const [viajes, setViajes] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState({
    viajes: true,
    choferes: true,
    vehiculos: true,
    empresas: true
  });
  const [filtros, setFiltros] = useState({
    fechaDesde: null,
    fechaHasta: null,
    busqueda: "",
    diasFuturos: 7,
    empresaId: "",
    choferId: "",
    vehiculoId: "",
    estado: ""
  });

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [viajesRes, choferesRes, vehiculosRes, empresasRes] = await Promise.all([
          fetch("/viajes").then(res => res.json()),
          fetch("/choferes").then(res => res.json()),
          fetch("/vehiculos").then(res => res.json()),
          fetch("/empresas").then(res => res.json())
        ]);

        setViajes(viajesRes);
        setChoferes(choferesRes.filter(c => c.activo));
        setVehiculos(vehiculosRes.filter(v => v.activo));
        setEmpresas(empresasRes.filter(e => e.activo));
        
        setLoading({
          viajes: false,
          choferes: false,
          vehiculos: false,
          empresas: false
        });
      } catch (error) {
        console.error("Error fetching data:", error);
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
          if (!viaje.fecha_salida) return false;
          
          const fechaViaje = new Date(viaje.fecha_salida);
          const cumpleFechas = (
            (!filtros.fechaDesde || fechaViaje >= new Date(filtros.fechaDesde)) &&
            (!filtros.fechaHasta || fechaViaje <= new Date(filtros.fechaHasta))
          );
          
          const cumpleFiltrosEspecificos = (
            (!filtros.choferId || viaje.chofer_asignado?._id === filtros.choferId) &&
            (!filtros.vehiculoId || viaje.vehiculo_asignado?._id === filtros.vehiculoId) &&
            (!filtros.estado || viaje.estado === filtros.estado) &&
            (!filtros.busqueda || 
              (viaje.chofer_asignado?.nombre + ' ' + viaje.chofer_asignado?.apellido).toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              viaje.vehiculo_asignado?.patente.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              viaje.deposito_origen?.localizacion.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              viaje.deposito_destino?.localizacion.toLowerCase().includes(filtros.busqueda.toLowerCase()))
          );
          
          return cumpleFechas && 
                 fechaViaje >= hoy && 
                 fechaViaje <= fechaLimite && 
                 cumpleFiltrosEspecificos;
        });

      case 1: // Vehículos en tránsito
        return viajes.filter(viaje => 
          viaje.estado === 'en_camino' &&
          (!filtros.vehiculoId || viaje.vehiculo_asignado?._id === filtros.vehiculoId) &&
          (!filtros.busqueda || 
            viaje.vehiculo_asignado?.patente.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            (viaje.chofer_asignado?.nombre + ' ' + viaje.chofer_asignado?.apellido).toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      case 2: // Historial por empresa
        return viajes.filter(viaje => 
          (filtros.empresaId ? viaje.empresa_asignada?._id === filtros.empresaId : true) &&
          (!filtros.busqueda || 
            viaje.empresa_asignada?.nombre_empresa.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            viaje.vehiculo_asignado?.patente.toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      case 3: // Historial por chofer
        return viajes.filter(viaje => 
          (filtros.choferId ? viaje.chofer_asignado?._id === filtros.choferId : true) &&
          (!filtros.busqueda || 
            (viaje.chofer_asignado?.nombre + ' ' + viaje.chofer_asignado?.apellido).toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            viaje.vehiculo_asignado?.patente.toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      case 4: // Tiempos promedio
        const results = calculateAverageTimes();
        return filtros.busqueda 
          ? results.filter(item => 
              item.origen.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              item.destino.toLowerCase().includes(filtros.busqueda.toLowerCase()))
          : results;

      default:
        return [];
    }
  };

  // Calculate average times between depots
  const calculateAverageTimes = () => {
    const depotPairs = {};
    
    viajes.forEach(viaje => {
      if (viaje.estado === 'completado' && viaje.deposito_origen && viaje.deposito_destino) {
        const key = `${viaje.deposito_origen._id}-${viaje.deposito_destino._id}`;
        const duration = (new Date(viaje.fecha_llegada) - new Date(viaje.fecha_salida)) / (1000 * 60 * 60); // in hours
        
        if (!depotPairs[key]) {
          depotPairs[key] = {
            origen: viaje.deposito_origen.localizacion,
            destino: viaje.deposito_destino.localizacion,
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
      { id: "fecha_salida", label: "Fecha", minWidth: 120, render: (value) => new Date(value).toLocaleDateString("es-AR") },
      { id: "vehiculo_asignado", label: "Vehículo", minWidth: 100, render: (v) => v?.patente || "Sin asignar" },
      { id: "chofer_asignado", label: "Chofer", minWidth: 150, render: (c) => c ? `${c.nombre} ${c.apellido}` : "Sin asignar" },
      { id: "deposito_origen", label: "Origen", minWidth: 120, render: (d) => d?.localizacion?.slice(0, 15) + (d?.localizacion?.length > 15 ? "..." : "") },
      { id: "deposito_destino", label: "Destino", minWidth: 120, render: (d) => d?.localizacion?.slice(0, 15) + (d?.localizacion?.length > 15 ? "..." : "") },
      { 
        id: "estado", 
        label: "Estado", 
        minWidth: 100,
        render: (estado) => (
          <span style={{ 
            color: estado === "completado" ? "green" : 
                  estado === "en_camino" ? "orange" : "gray"
          }}>
            {estado}
          </span>
        )
      }
    ],
    // Tab 1: Vehículos en tránsito
    [
      { id: "vehiculo_asignado", label: "Vehículo", minWidth: 100, render: (v) => v?.patente || "Sin asignar" },
      { id: "chofer_asignado", label: "Chofer", minWidth: 150, render: (c) => c ? `${c.nombre} ${c.apellido}` : "Sin asignar" },
      { id: "deposito_origen", label: "Origen", minWidth: 120, render: (d) => d?.localizacion },
      { id: "deposito_destino", label: "Destino", minWidth: 120, render: (d) => d?.localizacion },
      { id: "fecha_salida", label: "Hora salida", minWidth: 120, render: (value) => new Date(value).toLocaleTimeString("es-AR") },
      { id: "tiempo_transcurrido", label: "Tiempo", minWidth: 80, 
        render: (_, row) => {
          if (!row.fecha_salida) return "N/A";
          const hours = Math.floor((new Date() - new Date(row.fecha_salida)) / (1000 * 60 * 60));
          return `${hours}h`;
        } 
      }
    ],
    // Tab 2: Historial por empresa
    [
      { id: "empresa_asignada", label: "Empresa", minWidth: 150, render: (e) => e?.nombre_empresa || "Sin asignar" },
      { id: "fecha_salida", label: "Fecha", minWidth: 120, render: (value) => value ? new Date(value).toLocaleDateString("es-AR") : "N/A" },
      { id: "vehiculo_asignado", label: "Vehículo", minWidth: 100, render: (v) => v?.patente || "Sin asignar" },
      { id: "estado", label: "Estado", minWidth: 100, 
        render: (estado) => (
          <span style={{ 
            color: estado === "completado" ? "green" : 
                  estado === "en_camino" ? "orange" : "gray"
          }}>
            {estado}
          </span>
        )
      }
    ],
    // Tab 3: Historial por chofer
    [
      { id: "chofer_asignado", label: "Chofer", minWidth: 150, render: (c) => c ? `${c.nombre} ${c.apellido}` : "Sin asignar" },
      { id: "fecha_salida", label: "Fecha", minWidth: 120, render: (value) => value ? new Date(value).toLocaleDateString("es-AR") : "N/A" },
      { id: "vehiculo_asignado", label: "Vehículo", minWidth: 100, render: (v) => v?.patente || "Sin asignar" },
      { id: "estado", label: "Estado", minWidth: 100, 
        render: (estado) => (
          <span style={{ 
            color: estado === "completado" ? "green" : 
                  estado === "en_camino" ? "orange" : "gray"
          }}>
            {estado}
          </span>
        )
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
    ]
  ];

  const filteredData = getFilteredData();
  const isLoading = Object.values(loading).some(v => v);

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      fechaDesde: null,
      fechaHasta: null,
      busqueda: "",
      diasFuturos: 7,
      empresaId: "",
      choferId: "",
      vehiculoId: "",
      estado: ""
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reportes de Transporte
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => {
            setActiveTab(newValue);
            limpiarFiltros();
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Viajes programados" />
          <Tab label="Vehículos en tránsito" />
          <Tab label="Historial por empresa" />
          <Tab label="Historial por chofer" />
          <Tab label="Tiempos promedio" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Barra de búsqueda general */}
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
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: filtros.busqueda && (
                  <InputAdornment position="end">
                    <ClearIcon 
                      onClick={() => setFiltros({...filtros, busqueda: ""})}
                      style={{ cursor: 'pointer' }}
                    />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Filtros específicos por pestaña */}
          {activeTab === 0 && (
            <>
              <Grid item xs={6} sm={4} md={2}>
                <TextField
                  fullWidth
                  label="Próximos días"
                  type="number"
                  size="small"
                  value={filtros.diasFuturos}
                  onChange={(e) => setFiltros({...filtros, diasFuturos: Math.max(1, Number(e.target.value))})}
                />
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filtros.estado}
                    label="Estado"
                    onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="en_camino">En camino</MenuItem>
                    <MenuItem value="completado">Completado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Chofer</InputLabel>
                  <Select
                    value={filtros.choferId}
                    label="Chofer"
                    onChange={(e) => setFiltros({...filtros, choferId: e.target.value})}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {choferes.map(chofer => (
                      <MenuItem key={chofer._id} value={chofer._id}>
                        {chofer.nombre} {chofer.apellido}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Vehículo</InputLabel>
                  <Select
                    value={filtros.vehiculoId}
                    label="Vehículo"
                    onChange={(e) => setFiltros({...filtros, vehiculoId: e.target.value})}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {vehiculos.map(vehiculo => (
                      <MenuItem key={vehiculo._id} value={vehiculo._id}>
                        {vehiculo.patente}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {activeTab === 2 && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Empresa</InputLabel>
                <Select
                  value={filtros.empresaId}
                  label="Empresa"
                  onChange={(e) => setFiltros({...filtros, empresaId: e.target.value})}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {empresas.map(empresa => (
                    <MenuItem key={empresa._id} value={empresa._id}>
                      {empresa.nombre_empresa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {activeTab === 3 && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Chofer</InputLabel>
                <Select
                  value={filtros.choferId}
                  label="Chofer"
                  onChange={(e) => setFiltros({...filtros, choferId: e.target.value})}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {choferes.map(chofer => (
                    <MenuItem key={chofer._id} value={chofer._id}>
                      {chofer.nombre} {chofer.apellido}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Selectores de fecha para pestañas relevantes */}
          {(activeTab === 0 || activeTab === 2 || activeTab === 3) && (
            <>
              <Grid item xs={6} sm={4} md={2}>
                <DatePicker
                  label="Desde"
                  value={filtros.fechaDesde}
                  onChange={(newValue) => setFiltros({...filtros, fechaDesde: newValue})}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <DatePicker
                  label="Hasta"
                  value={filtros.fechaHasta}
                  onChange={(newValue) => setFiltros({...filtros, fechaHasta: newValue})}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  minDate={filtros.fechaDesde}
                />
              </Grid>
            </>
          )}

          {/* Botón para limpiar filtros */}
          <Grid item xs={12} sm={6} md={1}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={limpiarFiltros}
              startIcon={<ClearIcon />}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
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
              padding: "8px 12px"
            }
          }}
        />
      )}
    </Container>
  );
}