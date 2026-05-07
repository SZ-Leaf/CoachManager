import { useQuery } from '@tanstack/react-query';

import Alert from '../../../components/ui/feedback/Alert.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import * as playerApi from '../../../services/playerService.js';
import * as teamApi from '../../../services/teamService.js';
import AppPage from '../AppPage.jsx';

import '../teams/teams.css';

export default function DashboardPage() {
  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.fetchTeams,
  });
  const playersQuery = useQuery({
    queryKey: ['players'],
    queryFn: playerApi.fetchPlayers,
  });

  const loading = teamsQuery.isLoading || playersQuery.isLoading;
  const err = teamsQuery.error || playersQuery.error;

  const nTeams = teamsQuery.data?.items?.length ?? 0;
  const nPlayers = playersQuery.data?.items?.length ?? 0;

  return (
    <AppPage
      title="Tableau de bord"
      description="Vue d’ensemble de votre espace coach."
    >
      {loading ? <Spinner /> : null}
      {err ? <Alert variant="error">{err.message}</Alert> : null}
      {!loading && !err ? (
        <div className="dashboard-stats">
          <div className="dashboard-card">
            <p className="dashboard-card__label">Équipes</p>
            <p className="dashboard-card__value">{nTeams}</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card__label">Joueurs</p>
            <p className="dashboard-card__value">{nPlayers}</p>
          </div>
        </div>
      ) : null}
    </AppPage>
  );
}
