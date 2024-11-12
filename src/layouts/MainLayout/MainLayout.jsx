import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// DB
import { auth } from '../../firebase.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Componentes
import { Header, Content, Footer, Sidebar } from '../../components';

// Estilos
import styles from './MainLayout.module.css';

const MainLayout = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const db = getFirestore();
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [navigate]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserInfo(docSnap.data());
                    } else {
                        setError('Usuário não encontrado.');
                    }
                } else {
                    navigate('/');
                }
            } catch (err) {
                setError('Erro ao carregar informações do usuário: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [db]);

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.layout}>
            {isSidebarOpen && (
            <Sidebar userType={userInfo?.userType} className={styles.sidebar} />
            )}
            <Header className={styles.header} onMenuClick={toggleSidebar} />
            <div className={`${styles.mainContent} ${isSidebarOpen ? styles.dimmed : ''}`}>
                <Content className={styles.content}>
                    <Outlet />
                </Content>
            </div>
            <Footer className={styles.footer} />  
        </div>
    );
};

export default MainLayout;
