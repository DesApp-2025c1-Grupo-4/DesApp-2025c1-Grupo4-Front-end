import { createTheme } from '@mui/material/styles';
import { grey, blue, indigo } from "@mui/material/colors";

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
        {
          props: { variant: 'modalCancel' },
          style: {
            mt: 2,
            alignSelf: 'flex-end',
            borderRadius: '8px',
            textTransform: 'none'
          }
        }
      ],
    },
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': { borderColor: grey[300] },
          },
          marginBottom: '16px',
        },
      },
    },
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
        
        {
          props: { variant: 'searchButton' },
            style: {
              borderRadius: '8px',
              border: `1px solid ${grey[300]}`,
              backgroundColor: 'background.paper',
              padding: '4px',
              width: '40px',    
              height: '40px',   
              '& svg': {
                fontSize: '1.3rem', 
              },
              '&:hover': { 
                backgroundColor: grey[100] 
              }
            }
        },
        {
          props: { variant: 'listInfoButton' },
          style: {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: indigo[500],
            '&:hover': {
              color: indigo[700],
              backgroundColor: 'transparent'
            }
          }
        }
      ],
    },
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
        },
        {
          props: { variant: 'footer' },
          style: {
            fontSize: '1.3em',
            color: grey[50]
          }
        }
      ],
      styleOverrides: {
        root: {
          color: '#062B60'
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          '&.pageContainer': {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          },
          '&.pageContent': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          },
          '&.footer': {
            backgroundColor: '#062B60',
            color: '#FFFFFF',
            paddingTop: '16px',
            paddingBottom: '16px',
            marginTop: 'auto',
            overflowX: 'auto',
          },
          '&.formContainer': {
            padding: '16px'
          },
          '&.fieldContainer': {
            marginBottom: '16px'
          }
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: grey[700],
          fontWeight: 'bold',
          marginBottom: '4px',
          '&.Mui-focused': {
            color: grey[700],
          },
          '&.requiredLabel': {
            color: grey[700],
            fontWeight: 'bold',
            marginBottom: '4px'
          }
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          '&.selectionList': {
            padding: 0
          }
        }
      }
    },
    MuiListItem: {
      variants: [
        {
          props: { variant: 'selectableItem' },
          style: {
            '&:hover': { 
              backgroundColor: blue[50],
              cursor: 'pointer'
            },
            position: 'relative',
            paddingRight: '48px'
          }
        }
      ]
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: 'selectionModal' },
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            boxShadow: 24,
            padding: '24px',
            borderRadius: '8px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }
        },
        {
          props: { variant: 'detailModal' },
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            boxShadow: 24,
            padding: '24px',
            borderRadius: '8px'
          }
        },
        {
          props: { variant: 'modalContent' },
          style: {
            flex: 1,
            overflow: 'auto',
            border: `1px solid ${grey[200]}`,
            borderRadius: '8px'
          }
        }
      ]
    },
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
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          marginRight: '16px',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '&.detailModal': {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            boxShadow: 24,
            padding: '24px',
            borderRadius: '8px'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        subtitle1: {
          '&.formSectionTitle': {
            color: 'primary.main',
            fontWeight: 'bold',
            marginBottom: '16px',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: grey[700],
          '&.Mui-checked': {
            color: indigo[500],
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginRight: '16px',
        },
      },
    },
  },
});

export default customMuiTheme;