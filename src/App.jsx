import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router.jsx';

import style from './App.module.css';

const App = () => {

  return (

    <BrowserRouter>
      <Router />
    </BrowserRouter>
    
  );

};

export default App;