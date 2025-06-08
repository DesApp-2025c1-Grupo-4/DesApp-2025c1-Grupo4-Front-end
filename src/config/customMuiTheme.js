import { createTheme } from '@mui/material/styles';
import { grey } from "@mui/material/colors";

const customMuiTheme = createTheme({
  palette: {
    primary: {
      main: '#062B60',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F38F2B',
      contrastText: '#FFFFFF',
    },
    background: {
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h5: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h6: {
      fontWeight: 'bold',
    },
    subtitle1: {
      fontWeight: 500,
    },
    body2: {
      fontWeight: 500,
    },
    topMenu: {
      color: '#0F2F62',
      fontSize: '1.7em',
      fontWeight: 'bold',
    },
  },
  components: {
    // Estilos para Botones (usados en MenuBotones.jsx, Filtro.jsx, MenuGrid.jsx)
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: '#F38F2B',
            color: '#FFFFFF',
          },
        },
        contained: {
          padding: '8px 16px',
          fontSize: '1.1rem',
          '&:hover': {
            backgroundColor: '#F38F2B',
            color: '#FFFFFF',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: '#F38F2B',
            color: '#FFFFFF',
          },
        },
        sizeLarge: {
          height: '50px',
          fontSize: '1rem',
        },
        sizeMedium: {
          height: '56px',
        },
      },
      variants: [
        {
          props: { variant: 'contained', size: 'large' },
          style: {
            height: '40px',
            fontSize: '1rem',
          },
        },
      ],
    },

    // Estilos para Tablas (Tabla.jsx)
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          fontSize: '16px',
          textAlign: 'center',
        },
        head: {
          backgroundColor: '#062B60',
          color: "white",
          fontWeight: 'bold',
          textAlign: 'center',
          border: 5,
        },
        body: {
          textAlign: 'center',
          fontWeight: 'semibold',
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
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          textAlign: 'center',
          padding: '16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
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
          display: 'flex', 
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          backgroundColor:  grey[100],
          margin: 0,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: 'space-between',
          alignItems: 'center', 
          paddingTop: '0.4em',
          paddingBottom: '0.4em',
          paddingLeft: '3em',
          paddingRight: '3em',
        },
      },
    },

    // Estilos para IconButton (Header.jsx)
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: {
    //       padding: '8px',
    //       color: '#062B60',
    //       '&:hover img': {
    //         transform: 'scale(1.5)',
    //         transition: 'transform 0.3s ease',
    //       },
    //     },
    //   },
    // },

    MuiIconButton: {
      variants: [
        {
          props: { variant: 'tableButtons' },
          style: {
            background: 'transparent',
            color: grey[900],
            border: '2px solid',
            borderColor: grey[900],
            padding: '0.2em',
            '&:hover': {
              transform: 'scale(1.1)',
              cursor: 'not-allowed',
            },
          },
        },
        {
          props: { variant: 'header' },
          style: {
            padding: '10px',
            backgroundColor: grey[300],
            color: grey[900],
            pointerEvents: "unset",
            cursor: "default",
            // Hover state
            '&:hover': {
              transform: 'scale(1.1)',
              cursor: 'pointer',
            },
          },
        },
        {
          props: { variant: 'home' },
          style: {
            padding: '10px',
            backgroundColor: grey[300],
            color: grey[900],
            pointerEvents: "unset",
            cursor: "default",
          },
        },
      ],
    },

    // Estilos para Paginación (Paginacion.jsx)
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 'bold',
          },
        },
      },
    },

    MuiSvgIcon: {
      variants: [
        {
          props: { variant: 'tableButtons' },
          style: {
            fontSize: '0.6em',
            fontWeight: 'semibold',
            color: grey[900]
          }
        },
        {
          props: { variant: 'biggerIcons' },
          style: {
            fontSize: '2.2rem',
            color: grey[900]
          }
        }
      ],
      styleOverrides: {
        root: {
          color: '#062B60'
        },
      },
    },

    // Estilos para Box (general)
    MuiBox: {
      styleOverrides: {
        root: {
          // Estilo para el contenedor principal de páginas
          '&.pageContainer': {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          },
          // Estilo para el contenido principal
          '&.pageContent': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          },
          // Estilo para el footer
          '&.footer': {
            backgroundColor: '#062B60',
            color: '#FFFFFF',
            paddingTop: '16px',
            paddingBottom: '16px',
            marginTop: 'auto',
            overflowX: 'auto',
          },
          // Estilo para el contenedor del grid de menú
          '&.menuGridContainer': {
            width: '100%',
            maxWidth: '1400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '32px',
          },
          // Estilo para el contenedor del logo
          '&.logoContainer': {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '48px',
          },
          // Estilo para el contenedor de items del footer
          '&.footerItems': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
          },
        },
      },
    },

    // Estilos para Stack (MenuBotones.jsx)
    MuiStack: {
      styleOverrides: {
        root: {
          '&.buttonStack': {
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            gap: '24px',
            alignItems: 'center',
          },
        },
      },
    },

    // Estilos para Grid (MenuGrid.jsx, Filtro.jsx)
    MuiGrid: {
      styleOverrides: {
        root: {
          '&.filterGrid': {
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
          },
          '&.menuGrid': {
            justifyContent: 'center',
          },
        },
        item: {
          '&.menuGridItem': {
            display: 'flex',
          },
        },
      },
    },

    // Estilos para CircularProgress
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          marginRight: '16px',
        },
      },
    },
  },
});

export default customMuiTheme;