//React
import React from 'react';
import { useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js';
import { signOut } from 'firebase/auth';

//Estilos
import style from './Header.module.css';
import logo from '../../assets/logo.jpg';

// Componentes
import { SearchBar } from '../../components';

const Header = () => {

    return (
        <div className={style.Header}>
            <img src={logo} id="logo" alt="Logo" />
            <SearchBar />
        </div>
    );
};

export default Header;
