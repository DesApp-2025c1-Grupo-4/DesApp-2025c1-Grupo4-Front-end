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
  const config = {
    viajes: {
      showCriterio: true,
      showDates: true,
      searchLabel: 'Buscar',
      registerButton: 'Registrar Viaje',
      seguimientoButton: 'Seguimiento',
      criterios: ['Empresa transportista', 'Chofer', 'Vehículo', 'Tipo de viaje'],
      searchField: null
    },
    empresas: {
      showCriterio: false,
      showDates: false,
      searchLabel: 'Buscar por CUIT',
      registerButton: 'Registrar Empresa',
      searchField: 'cuit'
    },
    choferes: {
      showCriterio: false,
      showDates: false,
      searchLabel: 'Buscar por CUIL',
      registerButton: 'Registrar Chofer',
      searchField: 'cuil'
    },
    depositos: {
      showCriterio: false,
      showDates: false,
      searchLabel: 'Buscar por Provincia/País',
      registerButton: 'Registrar Deposito',
      searchField: 'localizacion'
    },
    vehiculos: {
      showCriterio: false,
      showDates: false,
      searchLabel: 'Buscar por Patente',
      registerButton: 'Registrar Vehiculo',
      searchField: 'patente'
    }
  };

  const currentConfig = config[mode] || config.viajes;

  const fechaDesdeValue = filtros.fechaDesde ? new Date(filtros.fechaDesde) : null;
  const fechaHastaValue = filtros.fechaHasta ? new Date(filtros.fechaHasta) : null;

  useEffect(() => {
    const defaultCriteria = {
      empresas: 'CUIT',
      choferes: 'CUIL',
      depositos: 'Provincia/País',
      vehiculos: 'Patente',
      viajes: 'Empresa transportista'
    };
    
    if (defaultCriteria[mode]) {
      setFiltros(prev => ({ ...prev, criterio: defaultCriteria[mode] }));
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
      const searchFilters = currentConfig.searchField 
        ? { ...filtros, criterio: currentConfig.searchField }
        : filtros;
      onSearch(searchFilters);
    }
  };

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
                <Popup buttonName={currentConfig.registerButton} page="nuevo-viaje"/>
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
                },
              }}
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
                const defaultCriteria = {
                  empresas: 'CUIT',
                  choferes: 'CUIL',
                  depositos: 'Provincia/País',
                  vehiculos: 'Patente',
                  viajes: 'Empresa transportista'
                };
                
                setFiltros({ 
                  criterio: defaultCriteria[mode] || '', 
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