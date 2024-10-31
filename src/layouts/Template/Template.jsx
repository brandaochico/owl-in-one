import { Outlet } from 'react-router-dom';

import { Header, Content, Footer } from '../../components';

const Template = () => {
    return (
        <>
            <Content>
                <Outlet />
            </Content>
            <Footer />
        </>
    );
};

export { Template };