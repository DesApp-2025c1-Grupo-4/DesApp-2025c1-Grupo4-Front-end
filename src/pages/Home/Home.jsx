import Header from "../../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import logo3 from "../../assets/logo3.png";
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import icon4 from "../../assets/icon4.png";
import icon5 from "../../assets/icon5.png";
import icon6 from "../../assets/icon6.png";
import "../../index.css";

const Home = () => {
  const navigate = useNavigate();

  const items = [
  { icon: icon1, title: "Empresas Transportistas", path: "/empresas" },
  { icon: icon2, title: "Flota de Vehículos", path: "/flota" },
  { icon: icon3, title: "Choferes", path: "/choferes" },
  { icon: icon4, title: "Red de Depósitos", path: "/depositos" },
  { icon: icon5, title: "Registros de Viajes", path: "/registro-viajes" },
  { icon: icon6, title: "Reportes", path: "/reportes" }
];


  return (
    <>
      <Header title="Logística Acme SRL" />
      <div className="middle-image-container">
        <img src={logo3} alt="Imagen central" className="middle-image" />
      </div>
      <div className="icon-grid">
        {items.map((item, index) => (
          <div className="icon-card" key={index}>
            <img src={item.icon} alt={item.title} className="icon-image" />
            <h3>{item.title}</h3>
            <button onClick={() => navigate(item.path)}>Ir</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
