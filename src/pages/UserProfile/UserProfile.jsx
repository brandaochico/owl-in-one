import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';
import './UserProfile.css';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  if (loading) {
    return <p>Carregando informações do usuário...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="user-profile-container">
      <h2>Perfil do Usuário</h2>
      {isEditing ? (
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nova Senha (deixe em branco para não alterar)"
          />
          <button onClick={handleSave}>Salvar</button>
          <button onClick={handleEditToggle}>Cancelar</button>
        </div>
      ) : (
        <div>
          <p>Nome: {userInfo?.name}</p>
          <p>Email: {auth.currentUser.email}</p>
          <button onClick={handleEditToggle}>Editar</button>
        </div>
      )}
    </div>
  );
};

export { UserProfile };
