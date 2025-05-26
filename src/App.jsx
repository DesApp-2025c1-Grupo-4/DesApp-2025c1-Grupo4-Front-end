import { Box, Grid, Stack } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header";
import { AppRouter } from "./AppRouter";
import { Footer } from "./components/Footer";

export function App() {
  
  return (
    <BrowserRouter>
      <Stack direction='column'>
        <Grid container direction='row'>
          <Header />
        </Grid>
        <Box sx={{display: "flex", flexDirection: "column", height:"100vh", mx: { xs: 1, md: 4 }}}>
          <AppRouter />
        </Box>
        <Grid container direction='row' sx={{ top: 'auto', bottom: 0 }}>
          <Footer />
        </Grid>
      </Stack>
    </BrowserRouter>
  )
}
