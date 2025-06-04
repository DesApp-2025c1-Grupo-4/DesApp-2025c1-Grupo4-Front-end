import { createTheme } from '@mui/material/styles';

const customMuiTheme = createTheme({
  palette: {
    primary: {
      main: '#062B60',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F38F2B',
    },
    background: {
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h6: {
      fontWeight: 'bold',
    },
    body2: {
      fontWeight: 500,
    },
  },
  components: {
    // Estilos para Botones (usados en MenuBotones.jsx, Filtro.jsx, etc.)
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 'bold',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        contained: {
          padding: '8px 16px',
          fontSize: '1.1rem',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    // Estilos para Tablas (Tabla.jsx)
    MuiTable: {
      styleOverrides: {
        root: {
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
          minHeight: '300px',
          borderRadius: '8px',
          overflow: 'hidden',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          fontSize: '16px',
          textAlign: 'center',
          border: '1px solid #ddd',
        },
        head: {
          backgroundColor: '#062B60',
          color: 'white',
          fontWeight: 'bold',
        },
        body: {
          '&:nth-of-type(even)': {
            backgroundColor: '#f5f5f5',
          },
        },
      },
    },
    // Estilos para Cards (MenuGrid.jsx)
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          border: 'none', 
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', 
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    // Estilos para TextField (Buscador.jsx, Filtro.jsx)
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    // Estilos para AppBar (Header.jsx)
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          marginTop: 0,
          paddingTop: 0,
        },
      },
    },
  },
  components: {
  MuiBox: {
    styleOverrides: {
      root: {
        // Estilo para el contenedor principal de páginas
        pageContainer: {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        },
        // Estilo para el contenido principal
        pageContent: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }
      }
    }
  }
}
});

export default customMuiTheme;