import { Route, Routes } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout.jsx';
import AttendancePage from '../pages/app/attendance/AttendancePage.jsx';
import ClubPage from '../pages/app/club/ClubPage.jsx';
import DashboardPage from '../pages/app/dashboard/DashboardPage.jsx';
import InventoryPage from '../pages/app/inventory/InventoryPage.jsx';
import MessagesPage from '../pages/app/messages/MessagesPage.jsx';
import PlayersPage from '../pages/app/players/PlayersPage.jsx';
import TeamsPage from '../pages/app/teams/TeamsPage.jsx';
import LoginPage from '../pages/auth/login/LoginPage.jsx';
import RegisterPage from '../pages/auth/register/RegisterPage.jsx';
import HomePage from '../pages/home/HomePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<AppLayout />}>
        <Route path="/tableau-de-bord" element={<DashboardPage />} />
        <Route path="/club" element={<ClubPage />} />
        <Route path="/equipes" element={<TeamsPage />} />
        <Route path="/joueurs" element={<PlayersPage />} />
        <Route path="/presences" element={<AttendancePage />} />
        <Route path="/inventaire" element={<InventoryPage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
