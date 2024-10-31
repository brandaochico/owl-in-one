// src/components/Header.js
import React from 'react';
import style from './Header.module.css';
import logo from '../../assets/logo.jpeg';
import { Placeholder } from '../Placeholder';
import { SearchBar } from '../SearchBar';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.js';
import { signOut } from 'firebase/auth';

const Header = ({ userType }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Erro ao deslogar: ', error.message);
        }
    };

    const handleUserProfile = () => {
        navigate('/user');
    };

    const handleCreateCourse = () => {
        navigate('/create-course'); 
    };

    return (
        <div className={style.Header}>
            <img src={logo} id="logo" alt="Logo" />
            <SearchBar />
            <Placeholder />
            <div className={style.buttonsContainer}>
                {userType === 'professor' && (
                    <button onClick={handleCreateCourse}>Criar Curso</button>
                )}
                <button onClick={handleUserProfile}>Usuário</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export { Header };
