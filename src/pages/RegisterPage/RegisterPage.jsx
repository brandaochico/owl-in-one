import { FormRegister, Footer } from '../../components';

// Estilos
import style from './RegisterPage.module.css';

const RegisterPage = () => {
  return (
    <div className={style.RegisterPage}>
      <h2>Cadastro</h2>
      <FormRegister />
      <Footer />
    </div>
  );
};

export default RegisterPage;
