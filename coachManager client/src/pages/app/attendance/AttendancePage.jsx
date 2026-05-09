import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import * as teamApi from '../../../services/teamService.js';
import AppPage from '../AppPage.jsx';
import { ROUTES } from '../../../utils/routes.js';
import '../../../styles/pages/attendance-hub.css';

export default function AttendancePage() {
  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.fetchTeams,
  });

  const teams = teamsQuery.data?.items ?? [];

  return (
    <AppPage
      title="Appels / présences"
      description="Les feuilles d’appel sont liées à une équipe. Choisissez une équipe pour enregistrer les présences à l’entraînement."
    >
      <div className="attendance-hub">
        {teamsQuery.isLoading ? <Spinner /> : null}
        {teamsQuery.error ? (
          <Alert variant="error">{teamsQuery.error.message}</Alert>
        ) : null}

        {!teamsQuery.isLoading && teams.length === 0 ? (
          <EmptyState
            title="Aucune équipe"
            description="Créez une équipe pour pouvoir faire l’appel."
            action={
              <Link to={ROUTES.TEAMS} className="btn btn-primary">
                Gérer les équipes
              </Link>
            }
          />
        ) : null}

        {teams.length > 0 ? (
          <ul className="attendance-hub__list">
            {teams.map((t) => (
              <li key={t.id} className="attendance-hub__card">
                <div className="attendance-hub__card-main">
                  <h2 className="attendance-hub__team-name">{t.name}</h2>
                  <p className="attendance-hub__team-meta">
                    {[t.category, t.season].filter(Boolean).join(' · ') || 'Équipe'}
                  </p>
                </div>
                <div className="attendance-hub__card-actions">
                  <Link
                    to={ROUTES.TEAM_ROLL_CALL.replace(':id', String(t.id))}
                    className="btn btn-primary"
                  >
                    Faire l’appel
                  </Link>
                  <Link
                    to={ROUTES.TEAM_DETAILS.replace(':id', String(t.id))}
                    className="btn btn-secondary btn-sm"
                  >
                    Détails
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </AppPage>
  );
}
