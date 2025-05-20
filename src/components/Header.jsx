import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import '../index.css';

const Header = ({ title, centerTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogo1Click = () => navigate('/registro-viajes');
  const handleLogo2Click = () => navigate('/');

  return (
    <header className="header">
      <img src={logo1} alt="Logo 1" className="logo" onClick={handleLogo1Click} />
      <h1 className={`title ${centerTitle ? 'center-title' : ''}`}>{title}</h1>
      {location.pathname !== '/' && (
        <img src={logo2} alt="Logo 2" className="logo" onClick={handleLogo2Click} />
      )}
    </header>
  );
};

export default Header;


