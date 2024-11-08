// React
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// DB
import { getFirestore, addDoc, collection, getDocs } from 'firebase/firestore';
import { auth } from '../../firebase.js';

// Estilos
import style from './CreateCourse.module.css';


const CreateCourse = () => {
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const db = getFirestore();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagsCollection = collection(db, 'tags');
                const tagsSnapshot = await getDocs(tagsCollection);
                const tagsList = tagsSnapshot.docs.map(doc => doc.data().name);
                setTags(tagsList);
            } catch (err) {
                console.error("Erro ao carregar tags: ", err);
                setError("Erro ao carregar tags. Por favor, tente novamente mais tarde.");
            }
        };

        fetchTags();
    }, [db]);

    const handleTagSelect = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTagRemove = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'cursos'), {
                name: courseName,
                description,
                tags: selectedTags,
                createdBy: auth.currentUser.uid,
            });
            setCourseName('');
            setDescription('');
            setSelectedTags([]);
            setTagInput('');
            navigate('/HomeProfessor');
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
                <div className={style.tagsContainer}>
                    <p>Selecione Tags:</p>
                    <div className={style.tagsInputContainer}>
                        <input
                            type="text"
                            placeholder="Digite para buscar tags..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className={style.tagInput}
                        />
                        <div className={style.suggestions}>
                            {tags
                                .filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()))
                                .map(tag => (
                                    <div
                                        key={tag}
                                        className={style.suggestionItem}
                                        onClick={() => handleTagSelect(tag)}
                                    >
                                        {tag}
                                    </div>
                                ))}
                        </div>
                        <div className={style.selectedTags}>
                            {selectedTags.map(tag => (
                                <div key={tag} className={style.selectedTag}>
                                    {tag}
                                    <span onClick={() => handleTagRemove(tag)}>&times;</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button type="submit">Criar Curso</button>
            </form>
        </div>
    );
};

export default CreateCourse;
