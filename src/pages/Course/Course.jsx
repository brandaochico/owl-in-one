import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Estilos
import style from './Course.module.css';

const Course = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const db = getFirestore();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseDoc = doc(db, 'cursos', id);
        const courseSnap = await getDoc(courseDoc);

        if (courseSnap.exists()) {
          setCourse(courseSnap.data());
        } else {
          setError('Curso não encontrado.');
        }
      } catch (err) {
        setError('Erro ao carregar detalhes do curso: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, db]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p className={style.errorMessage}>{error}</p>;
  }

  return (
    <div className={style.courseDetailsContainer}>
      <h1>{course.name}</h1>
      <p>{course.description}</p>
      <p><strong>Duração:</strong> {course.duration} horas</p>
      <p><strong>Tags:</strong> {course.tags.join(', ')}</p>
    </div>
  );
};

export default Course;
