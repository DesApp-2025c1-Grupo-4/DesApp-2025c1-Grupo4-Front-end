import { BorderAllOutlined, BorderColor } from "@mui/icons-material";
import { createTheme } from "@mui/material";
import { blue, grey, lightBlue } from "@mui/material/colors";

export const customMuiTheme = createTheme({
  typography: {
    h3: {
      fontSize: '1.17em',
      fontWeight: 'bold',
      unicodeBidi: 'isolate',
      color: '#0F2F62',
      display: 'block',
      textAlign: 'center',
    },
    h4: {
      fontWeight: 'bold',
      color: lightBlue[700],
    },
    h5: {
      fontWeight: 'bold',
      color: blue[800],
      fontSize: '1.5rem',
    },
    subtitle1: {
      fontSize: '1rem',
    },
    subtitle2: {
      fontSize: '1.2rem',
    },
    footer: {
      fontSize: '0.9rem',
    },
    button: {
      textTransform: 'none',
    },
    topMenu: {
      color: '#0F2F62',
      fontSize: '2rem',
      fontWeight: 'bold',
    }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
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
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#062B60',
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: '#ED7B30', 
            transform: 'scale(1.1)',
            color: 'white'
          },
        }
      }
    },
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
            '&:hover': {
              transform: 'scale(1.1)',
              cursor: 'pointer',
            },
          },
        },
      ],
      // Style overrides
      styleOverrides: {
        root: {
          // Base styles
          padding: '12px',
          backgroundColor: grey[300],
          color: grey[900],
          pointerEvents: "unset",
          cursor: "default",
          // Hover state
          '&:hover': {
            backgroundColor: '#e0e0e0',
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
            fontWeight: 'semibold'
          }
        }
      ],
      styleOverrides: {
        root: {
          fontSize: '2,6em',   // Adjust icon size
        },
      },
      // Optional: Set default props for all SVG icons
      defaultProps: {
        fontSize: 'large', // Default prop (e.g., 'small', 'medium', 'large')
      },
    },
  }
});
