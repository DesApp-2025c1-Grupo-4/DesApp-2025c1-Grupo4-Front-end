import { IconButton } from '@mui/material';

const IconButtonStyled = ({ onClick, icon: Icon }) => (
  <IconButton onClick={onClick} variant="searchButton" sx={{ '&:hover': { backgroundColor: 'grey.100' } }}>
    <Icon />
  </IconButton>
);

export default IconButtonStyled;