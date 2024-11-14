import { Routes, Route } from 'react-router-dom';

import { ScrollToTop } from './scripts';
import { MainLayout } from './layouts';
import { LoginPage, HomeAluno, HomeProfessor, RegisterPage } from './pages';
import { CreateCourse, UserProfile, CourseDetails, Course, CourseForum } from './pages';

const Router = () => {
    return (
      <>
      <ScrollToTop />
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
            <Route exact path="/HomeAluno" element={<HomeAluno />} />
            <Route exact path="/HomeProfessor" element={<HomeProfessor />} />
            <Route exact path="/user" element={<UserProfile />} />
            <Route exact path="/create-course" element={<CreateCourse />} />
            <Route exact path="/curso-details/:id" element={<CourseDetails />} />
            <Route exact path="/curso/:id" element={<Course />} />
            <Route exact path="/curso/:courseId/forum" element={<CourseForum />} />
        </Route>
      </Routes>
      </>
    );
};

export { Router };
