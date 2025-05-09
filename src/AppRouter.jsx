import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import NewPage from '../src/components/NewPage'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/newpage" element={<NewPage />} />
        <Route path="/newpage" element={<NewPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
