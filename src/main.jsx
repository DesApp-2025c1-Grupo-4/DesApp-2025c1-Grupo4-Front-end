
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRouter';
import { ThemeProvider } from '@mui/material/styles';
import customMuiTheme from './config/customMuiTheme';
import './assets/css/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={customMuiTheme}>
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);
