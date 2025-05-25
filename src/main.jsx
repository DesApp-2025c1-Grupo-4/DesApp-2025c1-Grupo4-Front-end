import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material';
import { customMuiTheme } from './config/customMuiTheme';

import { App } from './App';
import './assets/css/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={customMuiTheme}>
    <App />
  </ThemeProvider>
)
