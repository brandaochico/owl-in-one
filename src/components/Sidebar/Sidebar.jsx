// React
import React from 'react';
import { useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js';
import { getFirestore } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; 

// Estilos
import styles from './Sidebar.module.css';



const Sidebar = ({ userType }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
          await signOut(auth);
          navigate('/');
        } catch (err) {
          setError('Erro ao deslogar: ' + err.message);
        }
      };

    const handleHome = () => {
      if (userType === 'aluno') {
        navigate('/HomeAluno');
      } else if (userType === 'professor') {
        navigate('/HomeProfessor');
      }
    }

    const handleUserProfile = () => {
        navigate('/user')
    };

    const handleCreateCourse = () => {
        navigate('/create-course')
    }

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Menu</h2>
      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={handleHome}>Home</li>
        <li className={styles.menuItem} onClick={handleUserProfile}>Usuário</li>
        {userType === 'professor' && (
                    <li className={styles.menuItem} onClick={handleCreateCourse}>Criar Curso</li>
        )}
        <li className={styles.menuItem} onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
