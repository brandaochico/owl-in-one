// React
import React, { useState } from 'react';

// DB
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { auth } from '../../firebase.js';

// Estilos
import style from './CreateCourse.module.css';

const CreateCourse = () => {
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');

    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'cursos'), {
                name: courseName,
                description,
                duration: parseInt(duration),
                tags: tags.split(',').map(tag => tag.trim()),
                createdBy: auth.currentUser.uid,
            });
            setCourseName('');
            setDescription('');
            setDuration('');
            setTags('');
            alert('Curso criado com sucesso!');
        } catch (err) {
            setError('Erro ao criar curso: ' + err.message);
        }
    };

    return (
        <div className={style.CreateCourse}>
            <h2>Criar Curso</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
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
                <input
                    type="text"
                    placeholder="Tags (separe por vírgula)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <button type="submit">Criar Curso</button>
            </form>
        </div>
    );
};

export default CreateCourse;
