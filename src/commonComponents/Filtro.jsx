import { Box, Grid, TextField, MenuItem, Button, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Popup from './Popup';

const Filtro = ({ 
  filtros, 
  setFiltros, 
  mode, // 'viajes', 'empresas', 'choferes', 'depositos', 'vehiculos'
  onSearch,
  onClear // Nueva prop para manejar limpieza
}) => {
  // Configuración por modo
  const config = {
    viajes: {
      showCriterio: true,
      showDates: true,
      searchLabel: 'Buscar',
      registerButton: 'Registrar Viaje',
      seguimientoButton: 'Seguimiento',
      criterios: ['Empresa transportista', 'Chofer', 'Vehículo', 'Tipo de viaje']
    },
    empresas: {
      showCriterio: false,
      showDates: false,
      searchLabel: 'Buscar por CUIT/RUT',
      registerButton: 'Registrar Empresa'
    },
    choferes: {
      showCriterio: false,
      showDates: false,
      searchLabel: 'Buscar por CUIL',
      registerButton: 'Registrar Chofer'
    },
    depositos: {
      showCriterio: false,
      showDates: false,
      searchLabel: 'Buscar por Provincia/País',
      registerButton: 'Registrar Deposito'
    },
    vehiculos: {
      showCriterio: false,
      showDates: false,
      searchLabel: 'Buscar por Patente',
      registerButton: 'Registrar Vehiculo'
    }
  };

  const currentConfig = config[mode] || config.viajes;

  const fechaDesdeValue = filtros.fechaDesde ? new Date(filtros.fechaDesde) : null;
  const fechaHastaValue = filtros.fechaHasta ? new Date(filtros.fechaHasta) : null;

  const handleDateChange = (name) => (date) => {
    setFiltros({ 
      ...filtros, 
      [name]: date ? date.toISOString().split('T')[0] : '' 
    });
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filtros);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="filterGrid">
        <Grid container spacing={3} alignItems="center">
          {mode === 'viajes' && (
            <>
              <Grid item xs={12} sm={6} md={1.5}>
                <Popup buttonName={currentConfig.registerButton} page={mode}/>
              </Grid>
              <Grid item xs={12} sm={6} md={1.5}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary"
                  onClick={() => console.log('Ir a Seguimiento')}
                >
                  {currentConfig.seguimientoButton}
                </Button>
              </Grid>
            </>
          )}

          {mode !== 'viajes' && currentConfig.registerButton && (
            <Grid item xs={12} sm={6} md={2}>
              <Popup buttonName={currentConfig.registerButton} page={mode}/>
            </Grid>
          )}
          {currentConfig.showCriterio && (
            <Grid item xs={12} sm={6} md={1.5}>
              <TextField 
                select 
                fullWidth 
                label="Criterio" 
                name="criterio" 
                value={filtros.criterio || ''} 
                onChange={(e) => setFiltros({ ...filtros, [e.target.name]: e.target.value })} 
                size="medium"
              >
                {currentConfig.criterios.map((criterio) => (
                  <MenuItem key={criterio} value={criterio}>{criterio}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          {/* Campo de Búsqueda */}
          <Grid item xs={12} sm={6} md={currentConfig.showCriterio ? 4 : 6.5}>
            <TextField
              fullWidth
              label={currentConfig.searchLabel}
              name="busqueda"
              value={filtros.busqueda || ''}
              onChange={(e) => setFiltros({ ...filtros, [e.target.name]: e.target.value })}
              size="medium"
            />
          </Grid>

          {/* Fecha Desde (solo en modo viajes) */}
          {currentConfig.showDates && (
            <Grid item xs={12} sm={6} md={1}>
              <DatePicker 
                label="Fecha Desde" 
                value={fechaDesdeValue} 
                onChange={handleDateChange('fechaDesde')} 
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          )}

          {/* Fecha Hasta (solo en modo viajes) */}
          {currentConfig.showDates && (
            <Grid item xs={12} sm={6} md={1}>
              <DatePicker 
                label="Fecha Hasta" 
                value={fechaHastaValue} 
                onChange={handleDateChange('fechaHasta')} 
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          )}

          {/* Botón de Buscar (para modos no viajes) */}
          {!currentConfig.showDates && (
            <Grid item xs={12} sm={6} md={2}>
              <Button 
                fullWidth 
                variant="contained" 
                color="secondary"
                onClick={handleSearch}
              >
                Buscar
              </Button>
            </Grid>
          )}

          {/* Botón de Limpiar */}
          <Grid item xs={12} sm={6} md={1.5}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => {
                setFiltros({ criterio: '', fechaDesde: '', fechaHasta: '', busqueda: '' });
                if (onClear) onClear(); // Llama a onClear al limpiar
              }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Filtro;