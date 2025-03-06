import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { AuthProvider } from './context/AuthProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
