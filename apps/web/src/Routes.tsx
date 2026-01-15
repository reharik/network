import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './Layout';

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
  return { default: mod.Login };
});
const Signup = lazy(async () => {
  const mod = await import('./pages/Signup');
  return { default: mod.Signup };
});

export const NavRoutes = () => {
  return (
    <Routes>
      {/* all app routes share the Layout and require authentication */}
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Today />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="contacts/:id" element={<ContactDetail />} />
        <Route path="import" element={<ImportPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* catch-all */}
      <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
    </Routes>
  );
};
