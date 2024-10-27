import { Outlet } from 'react-router-dom';

import { Header, Footer, Content } from '../../components';

const Template = () => {

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

export { Template };