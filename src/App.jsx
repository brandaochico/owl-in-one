import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router.jsx';

import './App.css'

//import { Header, Content } from './components';
import { Home } from './pages';

const App = () => {

  return (

    <BrowserRouter>
      <Router />
    </BrowserRouter>
    
  );

};

export { App };
