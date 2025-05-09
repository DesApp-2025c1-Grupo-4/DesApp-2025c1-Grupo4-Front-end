import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Home from '../src/components/Home'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/newpage" element={<Home />} />
        <Route path="/newpage" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
