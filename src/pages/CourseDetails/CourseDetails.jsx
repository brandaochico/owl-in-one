import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import style from './CourseDetails.module.css';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', videoLink: '' });
  const [editingLessonIndex, setEditingLessonIndex] = useState(null);
  const [editingLesson, setEditingLesson] = useState({ title: '', content: '', videoLink: '' });
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const courseDoc = doc(db, 'cursos', id);
      await updateDoc(courseDoc, course);
      setIsEditing(false);
    } catch (err) {
      setError('Erro ao salvar alterações: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewLessonChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({ ...prev, [name]: value }));
  };

  const addLesson = async () => {
    if (newLesson.title && newLesson.content && newLesson.videoLink) {
      try {
        const courseDoc = doc(db, 'cursos', id);
        await updateDoc(courseDoc, {
          lessons: arrayUnion(newLesson),
        });
        setCourse((prev) => ({
          ...prev,
          lessons: [...(prev.lessons || []), newLesson],
        }));
        setNewLesson({ title: '', content: '', videoLink: '' });
      } catch (err) {
        setError('Erro ao adicionar aula: ' + err.message);
      }
    }
  };

  const startEditLesson = (index) => {
    setEditingLessonIndex(index);
    setEditingLesson(course.lessons[index]);
  };

  const handleEditLessonChange = (e) => {
    const { name, value } = e.target;
    setEditingLesson((prev) => ({ ...prev, [name]: value }));
  };

  const saveLessonEdit = async () => {
    try {
      const updatedLessons = [...course.lessons];
      updatedLessons[editingLessonIndex] = editingLesson;

      const courseDoc = doc(db, 'cursos', id);
      await updateDoc(courseDoc, { lessons: updatedLessons });

      setCourse((prev) => ({ ...prev, lessons: updatedLessons }));
      setEditingLessonIndex(null);
      setEditingLesson({ title: '', content: '', videoLink: '' });
    } catch (err) {
      setError('Erro ao salvar alterações da aula: ' + err.message);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p className={style.errorMessage}>{error}</p>;
  }

  return (
    <div className={style.courseDetailsContainer}>
      <div className={style.editCourseContainer}>
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={course.name || ''}
              onChange={handleChange}
              placeholder="Nome do Curso"
            />
            <textarea
              name="description"
              value={course.description || ''}
              onChange={handleChange}
              placeholder="Descrição do Curso"
            />
            <input
              type="number"
              name="duration"
              value={course.duration || ''}
              onChange={handleChange}
              placeholder="Duração em horas"
            />
            <input
              type="text"
              name="tags"
              value={course.tags ? course.tags.join(', ') : ''}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'tags',
                    value: e.target.value.split(',').map((tag) => tag.trim()),
                  },
                })
              }
              placeholder="Tags (separadas por vírgula)"
            />
            <button className={style.saveButton} onClick={handleSave}>
              Salvar
            </button>
          </>
        ) : (
          <>
            <h1>{course.name}</h1>
            <p className={style.courseDescription}>{course.description}</p>
            <p>
              <strong>Duração:</strong> {course.duration} horas
            </p>
            <p>
              <strong>Tags:</strong> {course.tags.join(', ')}
            </p>
            <button className={style.editButton} onClick={handleEditToggle}>
              Editar
            </button>
          </>
        )}
      </div>
      
      <div className={style.lessonContainer}>
      <h2>Aulas</h2>
      {course.lessons && course.lessons.map((lesson, index) => (
        <div key={index} className={style.lessonItem}>
          {editingLessonIndex === index ? (
            <>
              <input
                type="text"
                name="title"
                value={editingLesson.title}
                onChange={handleEditLessonChange}
                placeholder="Título da Aula"
              />
              <textarea
                name="content"
                value={editingLesson.content}
                onChange={handleEditLessonChange}
                placeholder="Descrição da Aula"
              />
              <input
                type="text"
                name="videoLink"
                value={editingLesson.videoLink}
                onChange={handleEditLessonChange}
                placeholder="Link para o Vídeo"
              />
              <button onClick={saveLessonEdit}>Salvar Alterações</button>
            </>
          ) : (
            <>
              <h3>{lesson.title}</h3>
              <p>{lesson.content}</p>
              <p><strong>Link para vídeo:</strong> {lesson.videoLink}</p>
              <button onClick={() => startEditLesson(index)}>Editar</button>
            </>
          )}
        </div>
      ))}
      </div>

      <div className={style.lessonFormContainer}>
        <h2>Adicionar Nova Aula</h2>
        <input
          type="text"
          name="title"
          value={newLesson.title}
          onChange={handleNewLessonChange}
          placeholder="Título da Aula"
        />
        <textarea
          name="content"
          value={newLesson.content}
          onChange={handleNewLessonChange}
          placeholder="Descrição da Aula"
        />
        <input
          type="text"
          name="videoLink"
          value={newLesson.videoLink}
          onChange={handleNewLessonChange}
          placeholder="Link para o Vídeo"
        />
        <button className={style.addButton} onClick={addLesson}>
          Adicionar Aula
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
