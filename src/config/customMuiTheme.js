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
      // Style overrides
      styleOverrides: {
        root: {
          // Base styles
          padding: '12px',
          backgroundColor: grey[300],
          color: grey[900],
          pointerEvents: "unset", // allow :hover styles to be triggered
          cursor: "default",
          // Hover state
          '&:hover': {
            backgroundColor: '#e0e0e0', 
            // transform: 'scale(1.1)',
            // color: 'orange'
          },
        },
      },
      // Default props for all IconButtons
      defaultProps: {
        color: 'primary', // Default color (primary, secondary, etc.)
        size: 'medium', // Default size (small, medium, large)
        disableRipple: false, // Enable/disable ripple globally
      },
    },
    MuiSvgIcon: {
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
