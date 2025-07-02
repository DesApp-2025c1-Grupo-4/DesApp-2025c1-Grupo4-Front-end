import { Box, Pagination, Typography } from '@mui/material';

const Paginacion = ({ pagina, setPagina, totalItems, itemsPorPagina, elemento }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2 }}>
    <Typography variant="body2">
      Mostrando {(pagina - 1) * itemsPorPagina + 1} - {Math.min(pagina * itemsPorPagina, totalItems)} de {totalItems} {elemento}
    </Typography>
    <Pagination count={Math.ceil(totalItems / itemsPorPagina)} page={pagina} 
      onChange={(_, value) => setPagina(value)} color="primary" showFirstButton showLastButton />
  </Box>
);

export default Paginacion;