// React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Estilos
import style from './HomeProfessor.module.css';
import logo from '../../assets/logo.jpg';

// Componentes
import { Banner, SearchBar } from '../../components';

const HomeProfessor = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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
        const coursesQuery = query(
          collection(db, 'cursos'),
          where('createdBy', '==', userId)
        );
        const querySnapshot = await getDocs(coursesQuery);
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesData);
      } catch (err) {
        setError('Erro ao carregar cursos: ' + err.message);
      }
    };

    fetchUserInfo();
  }, [db]);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return <p>Carregando informações...</p>;
  }

  if (error) {
    return <p className={style.errorMessage}>{error}</p>;
  }

  return (
    <div className={style.homeProfessorContainer}>
      <SearchBar onSearch={(queryText) => setSearchQuery(queryText)} />
      <Banner />
      <section className={style.section}>
        <h2>Meus Cursos</h2>
        <div className={style.courseContainer}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className={style.courseCard}
                onClick={() => navigate(`/curso-details/${course.id}`)}
              >
                <img src={logo} alt={course.name} className={style.courseImage} />
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <p>
                  <span className={style.tags}>
                    Tags: {course.tags.join(', ')}
                  </span>
                </p>
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
