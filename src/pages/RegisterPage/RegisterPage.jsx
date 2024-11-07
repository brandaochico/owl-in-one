// React
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

// Estilos
import style from './RegisterPage.module.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('aluno');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const db = getFirestore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    setError(''); 
    setSuccess(''); 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name, 
        userType: userType,
      });

      setSuccess('Usuário cadastrado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUserType('aluno');

      navigate('/');


    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className={style.registerContainer}>
      <h2>Cadastro</h2>
      {error && <p className={style.error}>{error}</p>}
      {success && <p className={style.success}>{success}</p>}
      <form onSubmit={handleRegister} className={style.registerForm}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <div className={style.userType}>
          <label>
            <input 
              type="radio" 
              value="aluno" 
              checked={userType === 'aluno'} 
              onChange={() => setUserType('aluno')} 
            />
            Aluno
          </label>
          <label>
            <input 
              type="radio" 
              value="professor" 
              checked={userType === 'professor'} 
              onChange={() => setUserType('professor')} 
            />
            Professor
          </label>
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p>
        Já tem uma conta?{' '}
        <Link to="/" className={style.loginLink}>Faça login aqui</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
