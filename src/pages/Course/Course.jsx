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
    return <p className={style.errorMessage}>Carregando...</p>;
  }

  if (error) {
    return <p className={style.errorMessage}>{error}</p>;
  }

  const getYouTubeVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className={style.courseDetailsContainer}>
      <div className={style.aboutCourse}>
        <h1>{course.name}</h1>
        <p className={style.courseDescription}>{course.description}</p>

        <div className={style.courseInfo}>
          <p><strong>Duração:</strong> {course.duration} horas</p>
          <p><strong>Tags:</strong> {course.tags.join(', ')}</p>
        </div>
      </div>

      <div className={style.lessonsContainer}>
        <h2>Aulas</h2>
        {course.lessons && course.lessons.length > 0 ? (
          course.lessons.map((lesson, index) => (
            <div key={index} className={style.lessonItem}>
              <div className={style.lessonContent}>
                <h3>{lesson.title}</h3>
                <p>{lesson.content}</p>
              </div>
              {lesson.videoLink && (
                <div className={style.videoContainer}>
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(lesson.videoLink)}`}
                    title="Vídeo da aula"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Este curso não possui aulas cadastradas.</p>
        )}
      </div>
    </div>
  );
};

export default Course;
