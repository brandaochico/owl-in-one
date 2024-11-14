import { useNavigate } from 'react-router-dom';
import { React, useEffect, useState } from 'react';

import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import logo from '../../assets/logo.jpg';
import style from './Logo.module.css';

const Logo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const db = getFirestore();

  // Função para redirecionar baseado no tipo de usuário
  const redirect = async () => {
    setIsLoading(true);
    setError('');

    try {
      const user = auth.currentUser;

      // Verifica se o usuário está autenticado
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      const userType = await getUserType(user.uid);

      // Redireciona baseado no tipo de usuário
      if (userType === 'aluno') {
        navigate('/HomeAluno');
      } else if (userType === 'professor') {
        navigate('/HomeProfessor');
      } else {
        setError('Tipo de usuário não encontrado');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter o tipo de usuário do Firestore
  const getUserType = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().userType;
    } else {
      throw new Error('Usuário não encontrado');
    }
  };

  // useEffect para redirecionar automaticamente se o usuário já estiver logado
  useEffect(() => {
    redirect();
  }, []);

  return (
    <div className={style.Logo} onClick={redirect}>
      <img src={logo} alt="Logo" />
      {error && <p>{error}</p>}
    </div>
  );
};

export default Logo;