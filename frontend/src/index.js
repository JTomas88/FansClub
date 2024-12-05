import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import injectContext from './store/AppContext'; // Importa el contexto

// Envuelve el componente App con el contexto
const AppWithContext = injectContext(App);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithContext /> {/* Usa la versión de App con el contexto inyectado */}
  </React.StrictMode>
);

// Si deseas medir el rendimiento, usa la función de reportWebVitals
reportWebVitals();
