// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/globalStyle';
import { theme } from './styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './Layout';
import { ScrollToTop } from './ui/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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

const qc = new QueryClient();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <BrowserRouter /* basename="/" */>
            <ScrollToTop />
            <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
              <Routes>
                {/* all app routes share the Layout and require authentication */}
                <Route element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Today />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="contacts/:id" element={<ContactDetail />} />
                  <Route path="import" element={<ImportPage />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* catch-all */}
                <Route
                  path="*"
                  element={<div style={{ padding: 16 }}>Not found</div>}
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
