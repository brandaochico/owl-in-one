// React
import React, { useEffect, useState } from 'react';

// DB
import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';

// Componentes
import { EditButton } from '../../components';

// Estilos
import style from './UserProfile.module.css';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const db = getFirestore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserInfo(docSnap.data());
            setFormData({
              name: docSnap.data().name,
              email: user.email, 
              password: '', 
            });
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, { name: formData.name });
        
        if (formData.email !== user.email) {
            await updateEmail(user, formData.email);
        }
        
        if (formData.password) {
            await updatePassword(user, formData.password);
        }

        setUserInfo({ ...userInfo, name: formData.name });
        setIsEditing(false);
        }
    } catch (err) {
        setError('Erro ao salvar informações: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) {
    return <p>Carregando informações do usuário...</p>;
  }

  if (error) {
    return <p className={style.error}>{error}</p>;
  }

  return (
    <div className={style.userProfileContainer}>
      <h2>Meu Perfil</h2>
      {isEditing ? (
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome"
            required
            className={style.input}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className={style.input}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nova Senha (deixe em branco para não alterar)"
            className={style.input}
          />
          <button onClick={handleSave} className={style.button}>Salvar</button>
          <EditButton handleEditToggle={handleEditToggle} text="Cancelar"></EditButton> 
        </div>
      ) : (
        <div>
          <EditButton handleEditToggle={handleEditToggle} text="Editar"></EditButton>
          <p>Nome: {userInfo?.name}</p>
          <p>Email: {auth.currentUser.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
