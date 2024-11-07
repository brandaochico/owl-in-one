// React
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

import style from './global.module.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
