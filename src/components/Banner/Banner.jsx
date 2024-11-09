// Estilos
import style from './Banner.module.css';

// React
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();

    const handleAbout = async () => {
        navigate('/')
      };

    return (
        <div className={style.welcomeSection}>
            <h1>Bem-vindo à Owl in One!</h1>
            <p>Amplie seus horizontes, a qualquer hora, em qualquer lugar.</p>
            <button onClick={handleAbout}>Sobre nós</button>
        </div>
    );
};

export default Banner;