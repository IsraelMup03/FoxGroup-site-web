import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LangueProvider } from './context/LangueContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LangueProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LangueProvider>
    </BrowserRouter>
  </StrictMode>
);
