import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// fonts are self-hosted, so the site makes no requests to Google Fonts
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource/instrument-serif/400-italic.css';
import './styles.css';
import { LangProvider } from './i18n.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>
);
