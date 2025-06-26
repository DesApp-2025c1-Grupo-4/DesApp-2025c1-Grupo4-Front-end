import { useEffect } from 'react';
import { Box, Grid, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Popup from './Popup';

const Filtro = ({ 
  filtros, 
  setFiltros, 
  mode,
  onSearch,
  onClear
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
      searchLabel: 'Buscar por CUIT',
      registerButton: 'Registrar Empresa',
      criterios: ['CUIT']
    },
    choferes: {
      showCriterio: false,
      showDates: false,
      searchLabel: 'Buscar por CUIL',
      registerButton: 'Registrar Chofer',
      criterios: ['CUIL']
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

  // Setea automáticamente el criterio CUIT si es modo empresas
  useEffect(() => {
    if (mode === 'empresas') {
      setFiltros(prev => ({ ...prev, criterio: 'CUIT' }));
    }
    if (mode === 'choferes') {
      setFiltros(prev => ({ ...prev, criterio: 'CUIL' }));
    }
  }, [mode, setFiltros]);

  const handleDateChange = (name) => (date) => {
    setFiltros({ 
      ...filtros, 
      [name]: date ? date.toISOString().split('T')[0] : '' 
    });
  };

  const handleSearch = () => {
    if (onSearch) {
      // Para empresas, siempre usamos el criterio CUIT
      const searchFilters = mode === 'empresas' 
        ? { ...filtros, criterio: 'CUIT' }
        : filtros;
      onSearch(searchFilters);
    }
  };

  // Manejar la tecla Enter en el campo de búsqueda
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="filterGrid">
        <Grid container spacing={3} alignItems="bottom">
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

          <Grid item xs={12} sm={6} md={currentConfig.showCriterio ? 4 : 6.5}>
            <TextField
              fullWidth
              label={currentConfig.searchLabel}
              name="busqueda"
              value={filtros.busqueda || ''}
              onChange={(e) => setFiltros({ ...filtros, [e.target.name]: e.target.value })}
              onKeyPress={handleKeyPress}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '58px', 
                },}}
            />
          </Grid>

          {currentConfig.showDates && (
            <>
              <Grid item xs={12} sm={6} md={1}>
                <DatePicker 
                  label="Fecha Desde" 
                  value={fechaDesdeValue} 
                  onChange={handleDateChange('fechaDesde')} 
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
                <DatePicker 
                  label="Fecha Hasta" 
                  value={fechaHastaValue} 
                  onChange={handleDateChange('fechaHasta')} 
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </>
          )}

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

          <Grid item xs={12} sm={6} md={1.5}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => {
                setFiltros({ 
                  criterio: mode === 'empresas' ? 'CUIT' : '', 
                  fechaDesde: '', 
                  fechaHasta: '', 
                  busqueda: '' 
                });
                if (onClear) onClear();
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