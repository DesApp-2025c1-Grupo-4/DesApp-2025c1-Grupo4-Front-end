import { Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const ErrorText = ({ children }) => (
  <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
    {children}
  </Typography>
);

export default ErrorText;