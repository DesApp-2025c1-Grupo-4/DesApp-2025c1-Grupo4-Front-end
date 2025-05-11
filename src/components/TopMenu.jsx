import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useLocation, useNavigate } from "react-router-dom";

function MenuOption({ path, label }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return <Box onClick={() => navigate(path)}>{label}</Box>;
}

function PageTitle() {
  const { pathname } = useLocation();
  var title;
  if(pathname == '/') { title = 'Logística Acme SRL'}
  else { title = 'Empresas transportistas'}
  return <Box 
    sx={{ typography: 'topMenu'}} 
  >
    {title}
  </Box>;
}

export function TopMenu() {
  return <Box sx={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '5rem', backgroundColor: grey[50], py: 4, px: 7 }}>
    <MenuOption path='/films' label='logo' />
    <PageTitle/>
    <MenuOption path='/actors' label='logo' />
  </Box>;
}