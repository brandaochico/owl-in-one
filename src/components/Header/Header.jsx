//React
import React from 'react';
import { useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js';
import { signOut } from 'firebase/auth';

//Estilos
import style from './Header.module.css';

// Componentes
import { SearchBar, Logo } from '../../components';

const Header = () => {

    return (
        <div className={style.Header}>
            <Logo />
            <SearchBar />
        </div>
    );
};

export default Header;
