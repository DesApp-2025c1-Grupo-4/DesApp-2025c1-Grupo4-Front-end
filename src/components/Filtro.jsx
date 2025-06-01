import React from 'react';
import { Box, Grid, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Filtro = ({ filtros, setFiltros }) => {
  const criteriosBusqueda = ['Empresa transportista', 'Chofer', 'Vehículo', 'Tipo de viaje'];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField select fullWidth label="Criterio" name="criterio" value={filtros.criterio || ''} onChange={(e) => setFiltros({ ...filtros, [e.target.name]: e.target.value })} size="medium">
              {criteriosBusqueda.map((criterio) => <MenuItem key={criterio} value={criterio}>{criterio}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker label="Fecha Desde" value={filtros.fechaDesde || null} onChange={(date) => setFiltros({ ...filtros, fechaDesde: date?.toISOString().split('T')[0] || '' })} slotProps={{ textField: { fullWidth: true } }}/>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker label="Fecha Hasta" value={filtros.fechaHasta || null} onChange={(date) => setFiltros({ ...filtros, fechaHasta: date?.toISOString().split('T')[0] || '' })} slotProps={{ textField: { fullWidth: true } }}/>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth variant="contained" onClick={() => setFiltros({ criterio: '', fechaDesde: '', fechaHasta: '' })} sx={{ height: '56px' }}>Limpiar</Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Filtro;