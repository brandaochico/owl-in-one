import { Routes, Route } from 'react-router-dom';

import { Template } from './layouts';

import { LoginPage, HomeAluno, HomeProfessor, RegisterPage } from './pages';

const Router = () => {
    return (
      <Routes>
        <Route path="/" element={<Template />}>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/HomeAluno" element={<HomeAluno />} />
            <Route exact path="/HomeProfessor" element={<HomeProfessor />} />
            <Route exact path="/register" element={<RegisterPage />} />
          </Route>
      </Routes>
    );
};

export { Router };