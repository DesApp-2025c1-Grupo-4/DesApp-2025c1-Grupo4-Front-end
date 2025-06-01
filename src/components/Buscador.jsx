import React from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Buscador = ({ busqueda, setBusqueda }) => (
  <Box>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Buscar por número, conductor, patente..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  </Box>
);

export default Buscador;