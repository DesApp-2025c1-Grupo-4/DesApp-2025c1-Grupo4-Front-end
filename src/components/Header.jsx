
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import '../index.css';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogo1Click = () => {
    navigate('/registro-viajes');
  };

  const handleLogo2Click = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <img src={logo1} alt="Logo 1" className="logo" onClick={handleLogo1Click} />
      <h1 className="title">{title}</h1>
      <img src={logo2} alt="Logo 2" className="logo" onClick={handleLogo2Click} />
    </header>
  );
};

export default Header;

