import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Estilos
import style from './HomeProfessor.module.css';
import logo from '../../assets/logo.jpg';

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
    return <p className={style.errorMessage}>{error}</p>;
  }

  return (
    <div className={style.homeProfessorContainer}>
      <div className={style.welcomeSection}>
        <h1>Bem-vindo à Owl in One!</h1>
        <p>Amplie seus horizontes,</p>
        <p>a qualquer hora, em qualquer lugar.</p>
        <button onClick={handleLogout} className={style.logoutButton}>Sair</button>
      </div>

      <section className={style.section}>
        <h2>Cursos Populares</h2>
        <div className={style.courseContainer}>
          {popularCourses.map((course) => (
            <div key={course.id} className={style.courseCard}>
              <img src={logo} alt={course.title} className={style.courseImage} />
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={style.section}>
        <h2>Meus Cursos</h2>
        <div className={style.courseContainer}>
          {courses.length > 0 ? (
            courses.map(course => (
              <div
                key={course.id}
                className={style.courseCard}
                onClick={() => navigate(`/curso/${course.id}`)}
              >
                <img src={logo} alt={course.name} className={style.courseImage} />
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <p> <spam className={style.tags}>Tags: {course.tags.join(', ')} </spam></p>
              </div>
            ))
          ) : (
            <p>Você ainda não criou nenhum curso.</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomeProfessor;
