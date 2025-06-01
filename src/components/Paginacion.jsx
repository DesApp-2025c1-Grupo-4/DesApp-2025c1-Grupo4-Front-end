import React from 'react';
import { Pagination, Box, Typography } from '@mui/material';

const Paginacion = ({ pagina, setPagina, totalItems }) => {
  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2 }}>
      <Typography variant="body2">
        Mostrando {(pagina - 1) * itemsPorPagina + 1} - {Math.min(pagina * itemsPorPagina, totalItems)} de {totalItems} viajes
      </Typography>
      <Pagination count={totalPaginas} page={pagina} onChange={(_, value) => setPagina(value)} color="primary" showFirstButton showLastButton />
    </Box>
  );
};

export default Paginacion;