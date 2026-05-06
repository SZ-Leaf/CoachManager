import { Route, Routes } from 'react-router';

import HomePage from '../pages/home/HomePage.jsx';
import LoginPage from '../pages/auth/login/LoginPage.jsx';
import RegisterPage from '../pages/auth/register/RegisterPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
