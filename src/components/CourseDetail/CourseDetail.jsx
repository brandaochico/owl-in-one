// CourseDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import CreateLesson from '../../components/CreateLesson/CreateLesson';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lessons, setLessons] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(db, 'cursos', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse(docSnap.data());
        } else {
          setError('Curso não encontrado.');
        }
      } catch (err) {
        setError('Erro ao carregar informações do curso: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchLessons = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cursos', courseId, 'aulas'));
        const lessonsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLessons(lessonsData);
      } catch (err) {
        setError('Erro ao carregar aulas: ' + err.message);
      }
    };

    fetchCourse();
    fetchLessons();
  }, [courseId, db]);

  const handleLessonCreated = () => {
    fetchLessons();
  };

  if (loading) {
    return <p>Carregando informações do curso...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <h2>{course.name}</h2>
      <p>{course.description}</p>
      <p>Duração: {course.duration} horas</p>

      <CreateLesson courseId={courseId} onLessonCreated={handleLessonCreated} />

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
    </div>
  );
};

export { CourseDetail };
