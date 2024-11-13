import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

// Estilos
import style from './HomeAluno.module.css';
import logo from '../../assets/logo.jpg';

// Componentes
import { Banner } from '../../components';

const HomeAluno = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]); // Para todos os cursos
  const [followedCourses, setFollowedCourses] = useState([]); // Para cursos seguidos
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

    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cursos'));
        const coursesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList);
      } catch (err) {
        setError('Erro ao carregar cursos: ' + err.message);
      }
    };

    const fetchFollowedCourses = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Consulta os cursos que o usuário segue
          const coursesQuery = query(
            collection(db, 'cursos'),
            where('followers', 'array-contains', user.uid)
          );
          const querySnapshot = await getDocs(coursesQuery);
          const followedCoursesList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFollowedCourses(followedCoursesList);
        }
      } catch (err) {
        setError('Erro ao carregar cursos seguidos: ' + err.message);
      }
    };

    fetchUserInfo();
    fetchCourses();
    fetchFollowedCourses();
  }, [db]);

  const handleCourseClick = (courseId) => {
    navigate(`/course-details/${courseId}`);
  };

  if (loading) {
    return <p>Carregando informações...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className={style.homeAlunoContainer}>
      <Banner />
      <section className={style.section}>
        <h2>Cursos Seguidos</h2>
        <div className={style.courseContainer}>
          {followedCourses.length > 0 ? (
            followedCourses.map((course) => (
              <div
                key={course.id}
                className={style.courseCard}
                onClick={() => navigate(`/curso/${course.id}`)}
              >
                <img src={logo} alt={course.name} className={style.courseImage} />
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <p>
                  <span className={style.tags}>Tags: {course.tags.join(', ')}</span>
                </p>
              </div>
            ))
          ) : (
            <p>Você não está seguindo nenhum curso ainda.</p>
          )}
        </div>
      </section>
      <section className={style.section}>
        <h2>Cursos Disponíveis</h2>
        <div className={style.courseContainer}>
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className={style.courseCard}
                onClick={() => navigate(`/curso/${course.id}`)}
              >
                <img src={logo} alt={course.name} className={style.courseImage} />
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <p>
                  <span className={style.tags}>Tags: {course.tags.join(', ')}</span>
                </p>
              </div>
            ))
          ) : (
            <p>Ainda não existe cursos na plataforma.</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomeAluno;
