import { IconButton } from '@mui/material';

const IconButtonStyled = ({ onClick, icon: Icon }) => (
  <IconButton
    onClick={onClick}
    variant="searchButton"
  >
    <Icon />
  </IconButton>
);

export default IconButtonStyled;