import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs, getDoc, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Estilos
import style from './CourseForum.module.css';

const CourseForum = () => {
  const { courseId } = useParams();
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [instructorId, setInstructorId] = useState(''); 
  const db = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const q = query(collection(db, 'forums'), where('courseId', '==', courseId));
        const querySnapshot = await getDocs(q);
        const topicsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopics(topicsList);
      } catch (err) {
        console.error('Erro ao carregar tópicos:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchInstructorId = async () => {
      try {
        const courseDoc = doc(db, 'cursos', courseId);
        const courseSnap = await getDoc(courseDoc);
        if (courseSnap.exists()) {
          const courseData = courseSnap.data();
          setInstructorId(courseData.createdBy || ''); 
        } else {
          console.error('Documento do curso não encontrado');
        }
      } catch (err) {
        console.error('Erro ao obter o ID do criador do curso:', err);
      }
    };

    fetchTopics();
    fetchInstructorId();
  }, [db, courseId]);

  const handleNewTopic = async () => {
    if (newTopic.trim()) {
      try {
        const docRef = await addDoc(collection(db, 'forums'), {
          courseId,
          title: newTopic,
          createdAt: new Date(),
          answers: [],
        });
        setTopics([...topics, { id: docRef.id, title: newTopic, createdAt: new Date(), answers: [] }]);
        setNewTopic('');
      } catch (err) {
        console.error('Erro ao criar tópico:', err);
      }
    }
  };

  const handleAddAnswer = async (topicId) => {
    if (newAnswer.trim() && currentUser) {
      try {
        const topicRef = doc(db, 'forums', topicId);
        const newAnswerData = {
          answer: newAnswer,
          createdAt: new Date(),
          user: {
            id: currentUser.uid,
            name: currentUser.displayName || currentUser.email || 'Usuário Anônimo',
            email: currentUser.email,
          },
          isInstructorAnswer: currentUser.uid === instructorId, 
        };

        await updateDoc(topicRef, {
          answers: arrayUnion(newAnswerData),
        });

        setNewAnswer('');

        const updatedTopics = topics.map((topic) =>
          topic.id === topicId
            ? { ...topic, answers: [...topic.answers, newAnswerData] }
            : topic
        );
        setTopics(updatedTopics);

      } catch (err) {
        console.error('Erro ao adicionar resposta:', err);
      }
    }
  };

  return (
    <div className={style.forumContainer}>
      <h1>Fórum do Curso</h1>

      <div className={style.newTopicSection}>
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Novo Tópico"
          className={style.newTopicInput}
        />
        <button onClick={handleNewTopic} className={style.addTopicButton}>
          Adicionar Tópico
        </button>
      </div>

      {loading ? (
        <p>Carregando tópicos...</p>
      ) : (
        <div className={style.topicList}>
          {topics.length > 0 ? (
            topics.map((topic) => (
              <div key={topic.id} className={style.topicCard}>
                <h3>{topic.title}</h3>
                <p className={style.topicDate}>Data: {topic.createdAt?.toDate ? topic.createdAt.toDate().toLocaleDateString() : ''}</p>

                <div className={style.answersSection}>
                  <input
                    type="text"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Digite sua resposta"
                    className={style.answerInput}
                  />
                  <button onClick={() => handleAddAnswer(topic.id)} className={style.addAnswerButton}>
                    Adicionar Resposta
                  </button>

                  {topic.answers && topic.answers.length > 0 ? (
                    <div className={style.answersList}>
                      {topic.answers.map((answer, index) => (
                        <div key={index} className={style.answerItem}>
                          <p>{answer.answer}</p>
                          <p>
                            <strong>{answer.user ? answer.user.name : 'Usuário Anônimo'}</strong>
                            {answer.isInstructorAnswer && (
                              <span className={style.instructorBadge}>Instrutor</span>
                            )} respondeu em {answer.createdAt?.toDate ? answer.createdAt.toDate().toLocaleDateString() : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Sem respostas ainda.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum tópico disponível.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseForum;
