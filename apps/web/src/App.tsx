// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NavRoutes } from './Routes';
import { GlobalStyle } from './styles/globalStyle';
import { theme } from './styles/theme';
import { ScrollToTop } from './ui/ScrollToTop';
import { ToastContainer } from './ui/Toast';

const Today = lazy(async () => {
  const mod = await import('./pages/Today');
  return { default: mod.Today };
});
const Contacts = lazy(async () => {
  const mod = await import('./pages/Contacts');
  return { default: mod.Contacts };
});
const ContactDetail = lazy(async () => {
  const mod = await import('./pages/ContactDetail');
  return { default: mod.ContactDetail };
});
const Settings = lazy(async () => {
  const mod = await import('./pages/Settings');
  return { default: mod.Settings };
});
const ImportPage = lazy(async () => {
  const mod = await import('./pages/Import');
  return { default: mod.ImportPage };
});
const Login = lazy(async () => {
  const mod = await import('./pages/Login');
  return { default: mod.default };
});

const qc = new QueryClient();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <QueryClientProvider client={qc}>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter /* basename="/" */>
              <ScrollToTop />
              <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
                <NavRoutes />
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
          <ToastContainer />
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
