import { Routes, Route } from 'react-router-dom';
import { LoginPage, HomeAluno, HomeProfessor, RegisterPage } from './pages';

const Router = () => {
    return (
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route path="/HomeAluno" element={<HomeAluno />} />
        <Route path="/HomeProfessor" element={<HomeProfessor />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
};

export { Router };