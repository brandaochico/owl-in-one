import React, { useState } from 'react';

// Estilos
import style from './LoginPage.module.css';
import logo from '../../assets/logo.jpg';

// Componentes
import { Footer, FormLogin } from '../../components';

const LoginPage = () => {
  return (
    <div className={style.LoginPage}>
      <div className={style.left}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={style.right}>
          <FormLogin />
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
