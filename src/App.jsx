import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage, RegisterPage, NotFoundPage, HomeAluno, HomeProfessor } from './assets/pages';
import { CourseDetail } from './assets/components';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/HomeAluno" element={<HomeAluno />} />
        <Route path="/HomeProfessor" element={<HomeProfessor />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/course/:courseId" element={<CourseDetail />} /> {/* Rota para os detalhes do curso */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;

