import { Route, Routes } from 'react-router-dom';

import { Template } from './layouts';

import { Home, PageNotFound } from './pages';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Template />}>
                <Route exact path="/" element={<Home />} />
                <Route path="*" element={<PageNotFound />} />
            </Route>
        </Routes>
    );
}

export { Router };