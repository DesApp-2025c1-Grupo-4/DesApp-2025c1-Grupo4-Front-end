import React from 'react';
import { Box, Grid, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Filtro = ({ filtros, setFiltros }) => {
  const criteriosBusqueda = ['Empresa transportista', 'Chofer', 'Vehículo', 'Tipo de viaje'];

  // Convertir strings a objetos Date cuando el componente carga
  const fechaDesdeValue = filtros.fechaDesde ? new Date(filtros.fechaDesde) : null;
  const fechaHastaValue = filtros.fechaHasta ? new Date(filtros.fechaHasta) : null;

  const handleDateChange = (name) => (date) => {
    // Guardar como string en formato YYYY-MM-DD
    setFiltros({ 
      ...filtros, 
      [name]: date ? date.toISOString().split('T')[0] : '' 
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <TextField 
              select 
              fullWidth 
              label="Criterio" 
              name="criterio" 
              value={filtros.criterio || ''} 
              onChange={(e) => setFiltros({ ...filtros, [e.target.name]: e.target.value })} 
              size="medium"
            >
              {criteriosBusqueda.map((criterio) => (
                <MenuItem key={criterio} value={criterio}>{criterio}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Buscar"
              name="busqueda"
              value={filtros.busqueda || ''}
              onChange={(e) => setFiltros({ ...filtros, [e.target.name]: e.target.value })}
              size="medium"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker 
              label="Fecha Desde" 
              value={fechaDesdeValue} 
              onChange={handleDateChange('fechaDesde')} 
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker 
              label="Fecha Hasta" 
              value={fechaHastaValue} 
              onChange={handleDateChange('fechaHasta')} 
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => setFiltros({ criterio: '', fechaDesde: '', fechaHasta: '', busqueda: '' })} 
              sx={{ height: '56px' }}
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