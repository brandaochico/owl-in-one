import { Route, Routes } from 'react-router-dom';

import { Home, PageNotFound } from './pages';

const Router = () => {
    return (
        <Routes>
            <Route>
                <Route exact path="/" element={<Home />} />
                <Route path="*" element={<PageNotFound />} />
            </Route>
        </Routes>
    );
}

export { Router };