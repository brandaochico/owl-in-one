import { Link } from 'react-router-dom';

import { FormRegister, Footer } from '../../components';

// Estilos
import style from './RegisterPage.module.css';

const RegisterPage = () => {
  return (
    <div className={style.RegisterPage}>
      <h2>Cadastro</h2>
      <FormRegister />
      <p>
        Já tem uma conta?{' '}
        <Link to="/" className={style.loginLink}>Faça login aqui</Link>
      </p>
      <Footer />
    </div>
  );
};

export default RegisterPage;
