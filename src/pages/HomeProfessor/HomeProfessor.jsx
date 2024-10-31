import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom'; 
import { Header } from '../../components'; 
import './HomeProfessor.css'; 

const HomeProfessor = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
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
            await fetchUserCourses(user.uid);
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

    const fetchUserCourses = async (userId) => {
      try {
        const coursesQuery = query(collection(db, 'cursos'), where('createdBy', '==', userId));
        const querySnapshot = await getDocs(coursesQuery);
        const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
      } catch (err) {
        setError('Erro ao carregar cursos: ' + err.message);
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
    <div className="home-professor-container">
      <Header userType={userInfo?.userType} /> 
      <h2>Eu sou um professor</h2>
      
      <h3>Meus Cursos</h3>
      {courses.length > 0 ? (
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <h4>{course.name}</h4>
              <p>{course.description}</p>
              <p>Duração: {course.duration} horas</p>
              <p>Tags: {course.tags.join(', ')}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você ainda não criou nenhum curso.</p>
      )}
    </div>
  );
};

export { HomeProfessor };
