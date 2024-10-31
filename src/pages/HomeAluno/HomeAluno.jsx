import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom'; 
import { Header } from '../../components'; 
import './HomeAluno.css'; 

const HomeAluno = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const db = getFirestore();
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid); 
          const docSnap = await getDoc(docRef); 

          if (docSnap.exists()) {
            setUserInfo(docSnap.data()); 
          } else {
            setError('Usuário não encontrado.');
          }
        } else {
          setError('Usuário não está autenticado.');
        }
      } catch (err) {
        setError('Erro ao carregar informações do usuário: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [db]);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      navigate('/');
    } catch (err) {
      setError('Erro ao deslogar: ' + err.message);
    }
  };

  if (loading) {
    return <p>Carregando informações...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="home-aluno-container">
      <Header /> 
      <h2>Bem-vindo, {userInfo?.name}</h2>
      <p>Email: {auth.currentUser.email}</p>
      <p>Tipo de usuário: {userInfo?.userType}</p>

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export { HomeAluno };
