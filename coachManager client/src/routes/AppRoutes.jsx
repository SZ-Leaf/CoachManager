import { Route, Routes } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout.jsx';
import AttendancePage from '../pages/app/attendance/AttendancePage.jsx';
import ClubPage from '../pages/app/club/ClubPage.jsx';
import DashboardPage from '../pages/app/dashboard/DashboardPage.jsx';
import InventoryPage from '../pages/app/inventory/InventoryPage.jsx';
import MessagesPage from '../pages/app/messages/MessagesPage.jsx';
import PlayersPage from '../pages/app/players/PlayersPage.jsx';
import PlayerDetailsPage from '../pages/app/players/PlayerDetailsPage.jsx';
import TeamsPage from '../pages/app/teams/TeamsPage.jsx';
import TeamDetailsPage from '../pages/app/teams/TeamDetailsPage.jsx';
import TeamRollCallPage from '../pages/app/teams/TeamRollCallPage.jsx';
import LoginPage from '../pages/auth/login/LoginPage.jsx';
import RegisterPage from '../pages/auth/register/RegisterPage.jsx';
import HomePage from '../pages/home/HomePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import { GuestRoute } from './GuestRoute.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/tableau-de-bord" element={<DashboardPage />} />
          <Route path="/club" element={<ClubPage />} />
          <Route path="/equipes" element={<TeamsPage />} />
          <Route path="/equipes/:id/appel" element={<TeamRollCallPage />} />
          <Route path="/equipes/:id" element={<TeamDetailsPage />} />
          <Route path="/joueurs" element={<PlayersPage />} />
          <Route path="/joueurs/:id" element={<PlayerDetailsPage />} />
          <Route path="/presences" element={<AttendancePage />} />
          <Route path="/inventaire" element={<InventoryPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
