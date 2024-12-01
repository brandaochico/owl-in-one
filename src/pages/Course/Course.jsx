import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, getDocs, collection, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import style from './Course.module.css';

const Course = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [newRating, setNewRating] = useState('');
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const db = getFirestore();
  const auth = getAuth();

  const user = auth.currentUser;

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

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        const coursesSnap = await getDocs(collection(db, 'cursos'));
        const courses = coursesSnap.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        const filteredCourses = courses.filter((recommendedCourse) => {
          if (!course?.tags) return false;
          return recommendedCourse.tags?.some((tag) => course.tags.includes(tag));
        });

        const sortedCourses = filteredCourses.sort((a, b) => {
          return (b.averageRating || 0) - (a.averageRating || 0);
        });

        setRecommendedCourses(sortedCourses.filter((recommendedCourse) => recommendedCourse.id !== id));
      } catch (err) {
        setError('Erro ao carregar cursos recomendados: ' + err.message);
      }
    };

    if (id) {
      fetchRecommendedCourses();
    }
  }, [id, db, course]);

  useEffect(() => {
    if (user && course) {
      const isUserFollowing = course.followers?.includes(user.uid);
      setIsFollowing(isUserFollowing);

      const userVote = course.ratings?.find((rating) => rating.uid === user.uid);
      if (userVote) {
        setUserRating(userVote.value);
      }
    }
  }, [user, course]);

  const handleFollowCourse = async () => {
    if (!user) {
      setError('Você precisa estar logado para seguir o curso.');
      return;
    }

    try {
      const courseDoc = doc(db, 'cursos', id);

      if (isFollowing) {
        await updateDoc(courseDoc, {
          followers: arrayRemove(user.uid),
        });
        setIsFollowing(false);
      } else {
        await updateDoc(courseDoc, {
          followers: arrayUnion(user.uid),
        });
        setIsFollowing(true);
      }
    } catch (err) {
      setError('Erro ao seguir o curso: ' + err.message);
    }
  };

  const handleRatingChange = async (value) => {
    if (!user) {
      setError('Você precisa estar logado para avaliar o curso.');
      return;
    }

    if (value < 1 || value > 5) {
      alert('Por favor, insira uma nota entre 1 e 5.');
      return;
    }

    try {
      const courseDoc = doc(db, 'cursos', id);

      const updatedRatings = [
        ...(course.ratings?.filter((rating) => rating.uid !== user.uid) || []),
        { uid: user.uid, value: parseInt(value, 10) },
      ];

      const totalRatings = updatedRatings.length;
      const averageRating = updatedRatings.reduce((acc, curr) => acc + curr.value, 0) / totalRatings;

      await updateDoc(courseDoc, {
        ratings: updatedRatings,
        totalRatings,
        averageRating,
      });

      setCourse((prev) => ({
        ...prev,
        ratings: updatedRatings,
        totalRatings,
        averageRating,
      }));
      setUserRating(value);
      setShowRatingModal(false);
    } catch (err) {
      setError('Erro ao atualizar sua avaliação: ' + err.message);
    }
  };

  const navigateToForum = () => {
    navigate(`/curso/${id}/forum`);
  };

  const handleCertificate = () => {
    if (!user) {
      alert('Você precisa estar logado para emitir o certificado.');
      return;
    }
  
    const doc = new jsPDF();
  
    // Cabeçalho
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Owl in One', 105, 20, { align: 'center' });
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text(`Certificado de Conclusão do Curso`, 105, 35, { align: 'center' });
  
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(16);
    doc.text(`"${course.name}"`, 105, 45, { align: 'center' });
  
    // Texto principal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    const courseDuration = course.duration || 'indefinida';
    const certificateText = `Certificamos que ${user.displayName || 'Usuário'} concluiu com sucesso o curso "${course.name}", com duração de ${courseDuration} hora(s), ministrado na plataforma Owl in One.`;
    doc.text(certificateText, 105, 60, { align: 'center', maxWidth: 180 });
  
    // Conteúdo das aulas
    doc.autoTable({
      head: [['Título da Aula', 'Descrição']],
      body: course.lessons.map((lesson) => [lesson.title, lesson.content]),
      startY: 80,
      theme: 'grid',
      styles: {
        halign: 'center',
      },
      headStyles: {
        fillColor: [0, 123, 255], 
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], 
      },
    });
  
    // Rodapé
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Data de emissão: ${new Date().toLocaleDateString()}`, 20, pageHeight - 20);
    doc.text('Emitido por Owl in One', 105, pageHeight - 20, { align: 'center' });
  
    // Salvar o PDF
    doc.save(`certificado_${course.name}.pdf`);
  };
  

  const getYouTubeVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (loading) {
    return <p className={style.errorMessage}>Carregando...</p>;
  }

  if (error) {
    return <p className={style.errorMessage}>{error}</p>;
  }

  return (
    <div className={style.courseDetailsContainer}>
      {user && (
        <button onClick={handleFollowCourse} className={style.followButton}>
          {isFollowing ? 'Deixar de seguir' : 'Seguir curso'}
        </button>
      )}

      <button onClick={navigateToForum} className={style.forumButton}>
        Ir para o Fórum
      </button>

      <button onClick={handleCertificate} className={style.certificateButton}>
        Emitir Certificado
      </button>

      <div className={style.aboutCourse}>
        <h1>{course.name}</h1>
        <p className={style.courseDescription}>{course.description}</p>

        <div className={style.courseInfo}>
          <p><strong>Duração:</strong> {course.duration} horas</p>
          <p><strong>Tags:</strong> {course.tags.join(', ')}</p>
          <p>
            <strong>Avaliação:</strong>{' '}
            {course.averageRating ? (
              <>
                {course.averageRating.toFixed(1)} estrela(s) ({course.totalRatings} votos)
              </>
            ) : (
              'Ainda não avaliado'
            )}
          </p>
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
          <p>Este curso não possui aulas cadastradas ainda.</p>
        )}
      </div>

      <div className={style.recommendedCoursesContainer}>
        <h2>Cursos Recomendados</h2>
        {recommendedCourses && recommendedCourses.length > 0 ? (
          recommendedCourses.map((recommendedCourse) => (
            <div key={recommendedCourse.id} className={style.recommendedCourseItem}>
              <h3>{recommendedCourse.name}</h3>
              <p>{recommendedCourse.description}</p>
              <button onClick={() => navigate(`/curso/${recommendedCourse.id}`)}>
                Ver curso
              </button>
            </div>
          ))
        ) : (
          <p>Não há cursos recomendados no momento.</p>
        )}
      </div>
    </div>
  );
};

export default Course;
