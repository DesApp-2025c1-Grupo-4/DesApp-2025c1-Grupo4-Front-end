import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => (
  <Box component="footer" sx={{ 
    backgroundColor: 'primary.main', 
    color: 'primary.contrastText', 
    py: 2,
    mt: 'auto',
    overflowX: 'auto'
  }}>
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 1,
        flexWrap: 'nowrap', 
        whiteSpace: 'nowrap' 
      }}>
        <Typography variant="body2">
          <strong>Materia:</strong> Desarrollo de Aplicaciones. 1er Cuatrimestre 2025. |
        </Typography>
        <Typography variant="body2">
          <strong>Integrantes:</strong> Hereñú Luis, Lois Erika Patricia, Nicolaus Brian Hernan, Ricci Paula, Torres Marcelo Alejandro. |
        </Typography>
        <Link 
          href="https://github.com/DesApp-2025c1-Grupo-4" 
          target="_blank" 
          rel="noopener noreferrer" 
          color="inherit" 
          underline="hover" 
          variant="body2"
        >
          Repositorio GitHub
        </Link>
      </Box>
    </Container>
  </Box>
);

export default Footer;