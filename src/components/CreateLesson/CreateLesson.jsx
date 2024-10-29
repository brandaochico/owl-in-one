import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { auth } from '../../firebase.js';

const CreateLesson = ({ courseId, onLessonCreated }) => {
  const [lessonName, setLessonName] = useState('');
  const [description, setDescription] = useState('');
  const [activity, setActivity] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState('');
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lessonName || !description || !activity || !videoFile) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const lessonRef = await addDoc(collection(db, 'cursos', courseId, 'aulas'), {
        name: lessonName,
        description,
        activity,
        videoUrl: await uploadVideo(videoFile),
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
      });
      
      setLessonName('');
      setDescription('');
      setActivity('');
      setVideoFile(null);
      onLessonCreated();
    } catch (error) {
      setError('Erro ao criar aula: ' + error.message);
    }
  };

  const uploadVideo = async (file) => {
    return 'url_do_video';
  };

  return (
    <div>
      <h3>Criar Nova Aula</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Aula"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição da Aula"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <textarea
          placeholder="Elaboração da Atividade"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          required
        ></textarea>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          required
        />
        <button type="submit">Criar Aula</button>
      </form>
    </div>
  );
};

export { CreateLesson };
