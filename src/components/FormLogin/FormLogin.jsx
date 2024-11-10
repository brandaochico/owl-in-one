// React
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 

// Estilos
import style from './FormLogin.module.css'

const FormLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const db = getFirestore();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userType = await getUserType(user.uid);
      
      if (userType === 'aluno') {
        navigate('/HomeAluno');
      } else if (userType === 'professor') {
        navigate('/HomeProfessor');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserType = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().userType;
    } else {
      throw new Error('Usuário não encontrado');
    }
};

    return (
        <div className={style.FormLogin}>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Login'}
          </button>
          <p>
            Não tem uma conta?{' '}
            <Link to="/Register">Cadastre-se aqui</Link>
          </p>
          {error && <spam className={style.error}>{error}</spam>}
        </form>
        </div>
    );
};

export default FormLogin;