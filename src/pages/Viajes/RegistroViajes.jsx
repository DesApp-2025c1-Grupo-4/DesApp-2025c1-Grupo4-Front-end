import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';


const RegistroViajes = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header title="Registro de viajes" />
      <div className="registro-container">
        <div className="botones-container">
          <button className="boton" onClick={() => navigate('/registrar-viaje')}>
            Registrar Viaje
          </button>
          <button className="boton" onClick={() => navigate('/modificar-viaje')}>
            Modificar Viaje
          </button>
          <button className="boton" onClick={() => navigate('/seguimiento')}>
            Seguimiento
          </button>
          <button className="boton" onClick={() => navigate('/listado-viajes')}>
            Listado de viajes
          </button>
        </div>

        <div className="boton-atras-wrapper">
          <button className="boton-atras" onClick={() => navigate('/')}>
            ATRAS
          </button>
        </div>
      </div>
    </>
  );
};

export default RegistroViajes;
