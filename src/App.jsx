import { Box, Grid, Stack } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { AppRouter } from "./AppRouter";


export function App() {
  
  return (
    <BrowserRouter>
      <Stack direction='column'>
        <Grid container direction='row'>
          <NavBar />
        </Grid>
        <Box sx={{mx: { xs: 1, md: 4 }, my: 4}}>
          <AppRouter />
        </Box>
        <Grid container direction='row'>
          <Footer />
        </Grid>
      </Stack>
    </BrowserRouter>
  )
}
