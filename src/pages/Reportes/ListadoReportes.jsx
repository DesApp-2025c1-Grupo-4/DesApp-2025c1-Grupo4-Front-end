import { useState, useEffect } from "react";
import { 
  Box, Container, Typography, TextField, CircularProgress, Tabs, Tab, 
  Select, MenuItem, FormControl, InputLabel, Grid, Paper, Button, 
  InputAdornment, Chip 
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { grey, blue } from "@mui/material/colors";
import Tabla2 from "../../commonComponents/Tabla2";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { 
  getViajes,
  getViajesCompletados,
  getViajesEnTransito,
  getViajesConIncidentes
} from '../../services/Viajes/ViajeServices';
import { getActiveChoferes } from '../../services/Choferes/ChoferService';
import { getActiveVehiculos } from '../../services/Vehiculos/VehiculoService';
import { getActiveEmpresas } from '../../services/Empresas/EmpresaService';
import { getActiveDepositos } from '../../services/Depositos/DepositoService';

const ESTADOS_VIAJE = [
  { value: "planificado", label: "Planificado", color: "default" },
  { value: "en transito", label: "En tránsito", color: "primary" },
  { value: "completado", label: "Completado", color: "success" },
  { value: "demorado", label: "Demorado", color: "warning" },
  { value: "incidente", label: "Incidente", color: "error" },
  { value: "cancelado", label: "Cancelado", color: "error" }
];

const TAB_CONFIG = [
  { label: "Viajes programados", filterKey: "programados" },
  { label: "Vehículos en tránsito", filterKey: "enTransito" },
  { label: "Historial por empresa", filterKey: "empresa" },
  { label: "Historial por chofer", filterKey: "chofer" },
  { label: "Tiempos promedio", filterKey: "tiempos" },
  { label: "Incidentes", filterKey: "incidentes" }
];

const ListadoReportes = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState({
    viajes: [], choferes: [], vehiculos: [], empresas: [], depositos: []
  });
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fechaDesde: null, fechaHasta: null, busqueda: "", diasFuturos: 7,
    empresaId: "", choferId: "", vehiculoId: "", estado: "",
    depositoOrigenId: "", depositoDestinoId: ""
  });

  // Helper para obtener la primera fecha de estado "en transito" del historial
  const getFechaEnTransito = (historial) => {
    if (!historial || !Array.isArray(historial)) return null;
    const enTransito = historial.find(item => item.estado === "en transito");
    return enTransito ? enTransito.fecha : null;
  };

  // Helpers
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

  const formatFecha = (fechaStr) => {
    const fecha = parseFecha(fechaStr);
    return fecha ? fecha.toLocaleDateString("es-AR") + ' ' + fecha.toLocaleTimeString("es-AR", {hour: '2-digit', minute:'2-digit'}) : "N/A";
  };

  const normalizeId = (idOrObj) => {
    if (!idOrObj) return null;
    if (typeof idOrObj === 'string') return idOrObj;
    if (idOrObj._id) return idOrObj._id.toString();
    return null;
  };

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [viajesRes, choferesRes, vehiculosRes, empresasRes, depositosRes] = await Promise.all([
          getViajes(),
          getActiveChoferes(),
          getActiveVehiculos(),
          getActiveEmpresas(),
          getActiveDepositos()
        ]);

        setData({ viajes: viajesRes, choferes: choferesRes, vehiculos: vehiculosRes, empresas: empresasRes, depositos: depositosRes });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logic
  const getFilteredData = () => {
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + parseInt(filtros.diasFuturos));

    switch (activeTab) {
      case 0: // Viajes programados
        return data.viajes.filter(viaje => {
          const fechaViaje = parseFecha(viaje.inicio_viaje);
          if (!fechaViaje) return false;
          
          const cumpleFechas = (
            (!filtros.fechaDesde || fechaViaje >= new Date(filtros.fechaDesde)) &&
            (!filtros.fechaHasta || fechaViaje <= new Date(filtros.fechaHasta))
          );
          
          const cumpleFiltros = (
            (!filtros.choferId || normalizeId(viaje.chofer_asignado) === filtros.choferId) &&
            (!filtros.vehiculoId || normalizeId(viaje.vehiculo_asignado) === filtros.vehiculoId) &&
            (!filtros.empresaId || normalizeId(viaje.empresa_asignada) === filtros.empresaId) &&
            (!filtros.estado || viaje.estado === filtros.estado) &&
            (!filtros.depositoOrigenId || normalizeId(viaje.deposito_origen) === filtros.depositoOrigenId) &&
            (!filtros.depositoDestinoId || normalizeId(viaje.deposito_destino) === filtros.depositoDestinoId) &&
            (!filtros.busqueda || 
              (viaje.chofer_asignado?.nombre + ' ' + viaje.chofer_asignado?.apellido || '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
              (viaje.vehiculo_asignado?.patente || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
          );
          
          return cumpleFechas && fechaViaje >= hoy && fechaViaje <= fechaLimite && cumpleFiltros;
        });

      case 1: // Vehículos en tránsito
        return data.viajes.filter(viaje => 
          viaje.estado === 'en transito' &&
          (!filtros.vehiculoId || normalizeId(viaje.vehiculo_asignado) === filtros.vehiculoId) &&
          (!filtros.busqueda || 
            (viaje.vehiculo_asignado?.patente || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      case 2: // Historial por empresa
        return data.viajes.filter(viaje => 
          (filtros.empresaId ? normalizeId(viaje.empresa_asignada) === filtros.empresaId : true) &&
          (!filtros.busqueda || 
            (viaje.empresa_asignada?.nombre_empresa || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      case 3: // Historial por chofer
        return data.viajes.filter(viaje => 
          (filtros.choferId ? normalizeId(viaje.chofer_asignado) === filtros.choferId : true) &&
          (!filtros.busqueda || 
            (viaje.chofer_asignado?.nombre + ' ' + viaje.chofer_asignado?.apellido || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );

      case 5: // Incidentes y demoras
        return data.viajes.flatMap(viaje => {
          // Filtramos solo los estados de incidente o demorado del historial
          const incidentes = viaje.historial_estados?.filter(
            item => item.estado === "incidente" || item.estado === "demorado"
          ) || [];

          return incidentes.map(incidente => ({
            ...viaje,
            incidenteData: incidente,  
            estado: incidente.estado, 
            fechaOcurrencia: incidente.fecha 
          }));
        }).filter(item => 
          (!filtros.empresaId || normalizeId(item.empresa_asignada) === filtros.empresaId) &&
          (!filtros.busqueda || 
            (item.descripcion_incidente || '').toLowerCase().includes(filtros.busqueda.toLowerCase()))
        );


      default:
        return [];
    }
  };

  // Columns configuration
  const getColumns = () => {
    const baseColumns = {
      idViaje: {
        id: "_id",
        label: "ID Viaje",
        align: 'center',
        width: 100,
        render: (id) => id ? `#${id.substring(id.length - 6)}` : "N/A"
      },
      fechaInicio: {
        id: "inicio_viaje",
        label: "Fecha Inicio",
        align: 'center',
        width: 120,
        render: (fecha) => formatFecha(fecha)
      },
      vehiculo: {
        id: "vehiculo_asignado",
        align: 'center',
        label: "Vehículo",
        width: 100,
        render: (v) => v?.patente || "Sin asignar"
      },
      chofer: {
        id: "chofer_asignado",
        align: 'center',
        label: "Chofer",
        width: 150,
        render: (c) => c ? `${c.nombre} ${c.apellido}` : "Sin asignar"
      },
      empresa: {
        id: "empresa_asignada",
        align: 'center',
        label: "Empresa",
        width: 150,
        render: (e) => e?.nombre_empresa || "Sin asignar"
      },
      origen: {
        id: "deposito_origen",
        align: 'center',
        label: "Origen",
        width: 150,
        render: (d) => d?.localizacion?.direccion || "Sin dirección"
      },
      destino: {
        id: "deposito_destino",
        align: 'center',
        label: "Destino",
        width: 150,
        render: (d) => d?.localizacion?.direccion || "Sin dirección"
      },
      fechaOcurrencia: {
        id: "fechaOcurrencia",
        label: "Fecha Ocurrencia",
        align: 'center',
        width: 120,
        render: (fecha) => formatFecha(fecha)
      },
      estado: {
        id: "estado",
        label: "Estado",
        align: 'center',
        width: 100,
        render: (estado) => {
          const estadoObj = ESTADOS_VIAJE.find(e => e.value === estado) || { label: estado, color: "default" };
          return <Chip label={estadoObj.label} color={estadoObj.color} size="small" />;
        }
      }
    };

    return [
      // Tab 0: Viajes programados
      [baseColumns.idViaje,baseColumns.fechaInicio, baseColumns.vehiculo, baseColumns.chofer, baseColumns.empresa, baseColumns.origen, baseColumns.destino, baseColumns.estado],
      // Tab 1: Vehículos en tránsito
      [baseColumns.vehiculo, baseColumns.chofer, baseColumns.empresa, baseColumns.origen, baseColumns.destino, baseColumns.fechaInicio, 
        { id: "tiempo_transcurrido", label: "Tiempo", width: 80, render: (_, row) => {
          const inicio = parseFecha(row.inicio_viaje);
          return inicio ? `${Math.floor((new Date() - inicio) / (1000 * 60 * 60))}h` : "N/A";
        }}
      ],
      // Tab 2: Historial por empresa
      [baseColumns.fechaInicio,baseColumns.empresa, baseColumns.vehiculo, baseColumns.chofer, baseColumns.origen, baseColumns.destino, baseColumns.estado],
      // Tab 3: Historial por chofer
      [baseColumns.fechaInicio,baseColumns.chofer, baseColumns.vehiculo, baseColumns.empresa, baseColumns.origen, baseColumns.destino, baseColumns.estado],
      // Tab 4: Tiempos promedio
      [
        { id: "origen", label: "Origen", width: 150 },
        { id: "destino", label: "Destino", width: 150 },
        { id: "promedio", label: "Tiempo promedio (h)", width: 120 },
        { id: "minimo", label: "Mínimo (h)", width: 100 },
        { id: "maximo", label: "Máximo (h)", width: 100 },
        { id: "viajes", label: "Viajes", width: 80 }
      ],
      // Tab 5: Incidentes y demoras
      [baseColumns.idViaje,baseColumns.fechaOcurrencia, baseColumns.vehiculo, baseColumns.chofer, baseColumns.empresa, baseColumns.origen, baseColumns.destino, baseColumns.estado]
    ];
  };

  // Handlers
  const handleChoferChange = (choferId) => {
    const choferSeleccionado = data.choferes.find(c => normalizeId(c._id) === choferId);
    setFiltros({
      ...filtros,
      choferId,
      vehiculoId: choferSeleccionado?.vehiculo_defecto ? normalizeId(choferSeleccionado.vehiculo_defecto) : ""
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaDesde: null, fechaHasta: null, busqueda: "", diasFuturos: 7,
      empresaId: "", choferId: "", vehiculoId: "", estado: "",
      depositoOrigenId: "", depositoDestinoId: ""
    });
  };

  const getUltimoIncidente = (historial) => {
  if (!historial || !Array.isArray(historial)) return null;
  const incidentes = historial
    .filter(item => item.estado === "incidente" || item.estado === "demorado")
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  return incidentes.length > 0 ? incidentes[0].fecha : null;
};

  const filteredData = getFilteredData();
  const columns = getColumns();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
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
              '& .MuiTab-root': { fontWeight: 'bold', color: grey[700], '&.Mui-selected': { color: '#062B60' } },
              '& .MuiTabs-indicator': { backgroundColor: '#F38F2B', height: 3 }
            }}
          >
            {TAB_CONFIG.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
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
                  startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>,
                  endAdornment: filtros.busqueda && (
                    <InputAdornment position="end">
                      <ClearIcon onClick={() => setFiltros({...filtros, busqueda: ""})} style={{ cursor: 'pointer', color: grey[500] }} />
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: grey[300] } } }}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: grey[300] } } }}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontWeight: 'bold', mt: '-16px' }}>Chofer</InputLabel>
                    <Select
                      value={filtros.choferId}
                      label="Chofer"
                      onChange={(e) => handleChoferChange(e.target.value)}
                      sx={{ borderRadius: '8px', mt: '-16px', '& fieldset': { borderColor: grey[300] } }}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {data.choferes?.map(chofer => (
                        <MenuItem key={chofer._id} value={chofer._id}>
                          {`${chofer.nombre || ''} ${chofer.apellido || ''}`.trim() || 'Chofer sin nombre'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ mt: '-16px', fontWeight: 'bold' }}>Vehículo</InputLabel>
                    <Select
                      value={filtros.vehiculoId}
                      label="Vehículo"
                      onChange={(e) => setFiltros({...filtros, vehiculoId: e.target.value})}
                      sx={{ borderRadius: '8px', mt: '-16px', '& fieldset': { borderColor: grey[300] } }}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {data.vehiculos?.filter(v => 
                        !filtros.choferId || 
                        data.choferes.find(c => normalizeId(c._id) === filtros.choferId)?.vehiculo_defecto === v._id
                      ).map(vehiculo => (
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
                  <InputLabel sx={{ fontWeight: 'bold', mt: '-16px' }}>Empresa</InputLabel>
                  <Select
                    value={filtros.empresaId}
                    label="Empresa"
                    onChange={(e) => setFiltros({...filtros, empresaId: e.target.value})}
                    sx={{ borderRadius: '8px', mt: '-16px', '& fieldset': { borderColor: grey[300] } }}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {data.empresas?.map(empresa => (
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
                  <InputLabel sx={{ mt: '-16px', fontWeight: 'bold' }}>Chofer</InputLabel>
                  <Select
                    value={filtros.choferId}
                    label="Chofer"
                    onChange={(e) => setFiltros({...filtros, choferId: e.target.value})}
                    sx={{ borderRadius: '8px', mt: '-16px', '& fieldset': { borderColor: grey[300] } }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {data.choferes?.map(chofer => (
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
                            '& fieldset': { borderColor: grey[300] } 
                          } 
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
                    minDate={filtros.fechaDesde}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        size: 'small', 
                        sx: { 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '8px', 
                            mt: '-16px', 
                            '& fieldset': { borderColor: grey[300] } 
                          } 
                        } 
                      } 
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={6} sm={3} md={1.2}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={limpiarFiltros}
                sx={{ height: '40px', borderRadius: '8px', fontWeight: 'bold', mt: '-20px' }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
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
            columns={columns[activeTab]} 
            data={filteredData}
            sx={{
              "& .MuiTableCell-root": { padding: "12px 16px", fontSize: "0.875rem", textAlign: "center", fontWeight: 500 },
              "& .MuiTableCell-head": { backgroundColor: "#062B60", color: "white", fontWeight: "bold", fontSize: "0.875rem" }
            }}
          />
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default ListadoReportes;