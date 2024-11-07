// React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

// DB
import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; 

// Estilos
import style from './HomeProfessor.module.css';
import logo from '../../assets/logo.jpg';

// Componentes
import { Header } from '../../components';

const HomeProfessor = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [popularCourses] = useState([
    { id: 1, title: "Curso de React", description: "Aprenda React do zero!", image: "link_imagem_react" },
    { id: 2, title: "Curso de Node.js", description: "Domine o back-end com Node.js!", image: "link_imagem_node" },
    { id: 3, title: "Curso de Firebase", description: "Integre seu app com o Firebase!", image: "link_imagem_firebase" },
  ]);
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
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ backgroundColor: 'var(--pale-orange)', padding: '30px', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
          <h1>Bem-vindo à Owl in One!</h1>
          <p>Amplie seus horizontes,</p>
          <p>a qualquer hora, em qualquer lugar.</p>
          <button onClick={handleLogout} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#fff', color: '#4A90E2', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Sair</button>
        </div>

        <section style={{ marginTop: '40px' }}>
          <h2>Cursos Populares</h2>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            {popularCourses.map((course) => (
              <div key={course.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', width: '200px', textAlign: 'center' }}>
                <img src={logo} alt={course.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2>Meus Cursos</h2>
          {courses.length > 0 ? (
            <ul>
              {courses.map(course => (
                <li key={course.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '10px' }}>
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
        </section>
      </div>
    </div>
  );
};

export default HomeProfessor;