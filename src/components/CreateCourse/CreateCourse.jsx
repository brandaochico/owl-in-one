// React
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';

// DB
import { getFirestore } from 'firebase/firestore';

const CreateCourse = ({ onCourseCreated }) => {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDuration, setCourseDuration] = useState('');

  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'cursos'), {
        name: courseName,
        description: courseDescription,
        duration: courseDuration,
      });

      onCourseCreated();
      
      setCourseName('');
      setCourseDescription('');
      setCourseDuration('');
    } catch (err) {
      console.error('Erro ao criar curso:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={courseName} 
        onChange={(e) => setCourseName(e.target.value)} 
        placeholder="Nome do Curso" 
        required 
      />
      <input 
        type="text" 
        value={courseDescription} 
        onChange={(e) => setCourseDescription(e.target.value)} 
        placeholder="Descrição" 
        required 
      />
      <input 
        type="number" 
        value={courseDuration} 
        onChange={(e) => setCourseDuration(e.target.value)} 
        placeholder="Duração (horas)" 
        required 
      />
      <button type="submit">Criar Curso</button>
    </form>
  );
};

export default CreateCourse;
