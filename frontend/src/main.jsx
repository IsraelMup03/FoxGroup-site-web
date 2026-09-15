import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PanierProvider } from './context/PanierContext';
import { TauxProvider } from './context/TauxContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TauxProvider>
          <PanierProvider>
            <App />
          </PanierProvider>
        </TauxProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
