import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#13131A',
            color: '#FFFFFF',
            border: '1px solid #1E1E2E',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#00FF87', secondary: '#0A0A0F' } },
          error: { iconTheme: { primary: '#FF4D4D', secondary: '#0A0A0F' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
