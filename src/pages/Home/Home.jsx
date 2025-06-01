import React from "react";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer";
import MenuGrid from "../../components/MenuGrid";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ 
      '&.MuiBox-root': theme => theme.components.MuiBox.styleOverrides.root.pageContainer 
    }}>
      <Header />
      <Box sx={{ 
        '&.MuiBox-root': theme => theme.components.MuiBox.styleOverrides.root.pageContent 
      }}>
        <MenuGrid />
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;