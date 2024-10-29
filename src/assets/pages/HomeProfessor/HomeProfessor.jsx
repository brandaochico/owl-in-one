import React, { useEffect, useState } from 'react';
import { auth } from '../../../firebase';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom'; 
import CreateLesson from '../../components/CreateLesson/CreateLesson';
import './HomeProfessor.css'; 

const HomeProfessor = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]); 
  const [selectedCourseId, setSelectedCourseId] = useState(null); 
  const [lessons, setLessons] = useState([]); 
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
        const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
      } catch (err) {
        setError('Erro ao carregar cursos: ' + err.message);
      }
    };

    fetchUserInfo();
    fetchCourses();
  }, [db]);

  const fetchLessons = async (courseId) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cursos', courseId, 'aulas'));
      const lessonsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLessons(lessonsData);
    } catch (err) {
      setError('Erro ao carregar aulas: ' + err.message);
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    fetchLessons(courseId); 
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      setError('Erro ao deslogar: ' + err.message);
    }
  };

  const handleCourseCreated = () => {
    fetchCourses(); // Atualiza a lista de cursos após a criação
  };

  const CreateCourse = ({ onCourseCreated }) => {
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await addDoc(collection(db, 'cursos'), {
          name: courseName,
          description: description,
          duration: duration,
        });
        setCourseName('');
        setDescription('');
        setDuration('');
        onCourseCreated(); 
      } catch (err) {
        console.error('Erro ao criar curso: ', err);
        setError('Erro ao criar curso: ' + err.message);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <h3>Criar Curso</h3>
        <input
          type="text"
          placeholder="Nome do Curso"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Duração em horas"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <button type="submit">Criar Curso</button>
      </form>
    );
  };

  if (loading) {
    return <p>Carregando informações...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="home-professor-container">
      <h2>Bem-vindo, {userInfo?.name}</h2>
      <p>Email: {auth.currentUser.email}</p>
      <p>Tipo de usuário: {userInfo?.userType}</p>

      <CreateCourse onCourseCreated={handleCourseCreated} />

      <h3>Lista de Cursos</h3>
      <ul>
        {courses.map(course => (
          <li key={course.id} onClick={() => handleCourseSelect(course.id)}>
            <h4>{course.name}</h4>
            <p>{course.description}</p>
            <p>Duração: {course.duration} horas</p>
          </li>
        ))}
      </ul>

      {selectedCourseId && (
        <CreateLesson courseId={selectedCourseId} onLessonCreated={handleLessonCreated} />
      )}

      <h3>Lista de Aulas</h3>
      <ul>
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <h4>{lesson.name}</h4>
            <p>{lesson.description}</p>
            <p>Atividade: {lesson.activity}</p>
            <p>Vídeo: <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">Assistir</a></p>
          </li>
        ))}
      </ul>

      <button onClick={handleLogout} className="logout-button">Logout</button> 
    </div>
  );
};

export default HomeProfessor;
