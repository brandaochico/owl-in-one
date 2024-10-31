import { Routes, Route } from 'react-router-dom';

import { Template } from './layouts';
import { LoginPage, HomeAluno, HomeProfessor, RegisterPage} from './pages';
import CreateCourse from './pages/CreateCourse/CreateCourse';
import UserProfile from './pages/UserProfile/UserProfile'

const Router = () => {
    return (
      <Routes>
        <Route path="/" element={<Template />}>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/HomeAluno" element={<HomeAluno />} />
            <Route exact path="/HomeProfessor" element={<HomeProfessor />} />
            <Route exact path="/register" element={<RegisterPage />} />
            <Route exact path="/user" element={<UserProfile />} /> {/* Rota para a página do usuário */}
            <Route exact path="/create-course" element={<CreateCourse />} /> {/* Rota para criar curso */}
        </Route>
      </Routes>
    );
};

export { Router };
