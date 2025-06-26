import { Box, InputLabel } from '@mui/material';
import ErrorText from '../ErrorText';

const FieldContainer = ({ label, children, error }) => (
  <Box className="fieldContainer">
    <InputLabel className="requiredLabel">
      {label}
    </InputLabel>
    {children}
    {error && <ErrorText>{error}</ErrorText>}
  </Box>
);

export default FieldContainer;