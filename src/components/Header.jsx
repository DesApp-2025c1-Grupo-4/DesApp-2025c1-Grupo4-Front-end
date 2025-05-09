import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';

const Header = () => {
  const navigate = useNavigate();

  const handleLogo1Click = () => {
    alert('Logo 1 clickeado');
  };

  const handleLogo2Click = () => {
    navigate('/newpage');
  };

  return (
    <header style={styles.header}>
      <img src={logo1} alt="Logo 1" style={styles.logo} onClick={handleLogo1Click} />
      <h1 style={styles.title}>Viajes</h1>
      <img src={logo2} alt="Logo 2" style={styles.logo} onClick={handleLogo2Click} />
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
  },
  logo: {
    width: '50px',
    height: '50px',
    cursor: 'pointer',
  },
  title: {
    margin: 0,
  },
};

export default Header;

