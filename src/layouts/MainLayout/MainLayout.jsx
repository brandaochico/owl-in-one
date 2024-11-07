import { Outlet } from 'react-router-dom';

import { Header, Content, Footer } from '../../components';

const MainLayout = () => {
    return (
        <>
            <Header />
            <Content>
                <Outlet />
            </Content>
            <Footer />
        </>
    );
};

export default MainLayout;