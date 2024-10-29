import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase'; // Importando a instância do Firebase
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importando o método de login
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Importando Firestore
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Usando o hook para navegação
  const db = getFirestore(); // Inicializando Firestore

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Realiza o login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Obtém o tipo de usuário do Firestore
      const userType = await getUserType(user.uid);
      
      // Redireciona com base no tipo de usuário
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

  // Função para obter o tipo de usuário do Firestore
  const getUserType = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId)); // Busca o documento do usuário
    if (userDoc.exists()) {
      return userDoc.data().userType; // Retorna o tipo de usuário
    } else {
      throw new Error('Usuário não encontrado');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
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
      </form>
      <p>
        Não tem uma conta?{' '}
        <Link to="/Register" className="register-link">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default LoginPage;
