// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NavRoutes } from './Routes';
import { GlobalStyle } from './styles/globalStyle';
import { theme } from './styles/theme';
import { ScrollToTop } from './ui/ScrollToTop';
import { ToastContainer } from './ui/Toast';

const qc = new QueryClient();

export const App = () => {
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
};
