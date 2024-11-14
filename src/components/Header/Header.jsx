import React from 'react';
import { useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js';
import { signOut } from 'firebase/auth';

// Estilos
import style from './Header.module.css';

// Componentes
import { Logo } from '../../components';
import { MenuIcon } from '../../assets';

const Header = ({ onMenuClick }) => {
  const handleMenuClick = (event) => {
    event.stopPropagation();
    if (onMenuClick) {
      onMenuClick();
    }
  };

    return (
      <div className={style.Header}>
        <MenuIcon onClick={handleMenuClick} />
        <Logo />
      </div>
    );
};

export default Header;
