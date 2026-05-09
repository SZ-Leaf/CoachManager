import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import * as playerApi from '../../../services/playerService.js';
import * as teamApi from '../../../services/teamService.js';
import AppPage from '../AppPage.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import { ROUTES } from '../../../utils/routes.js';

const PlayerDetailsPage = () => {
  const { id } = useParams();

  const playerQuery = useQuery({
    queryKey: ['player', id],
    queryFn: () => playerApi.fetchPlayer(id),
  });

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.fetchTeams,
  });

  const player = playerQuery.data?.item || playerQuery.data?.player || playerQuery.data;
  const teams = teamsQuery.data?.items || [];
  const team = teams.find(t => String(t.id) === String(player?.teamId));

  if (playerQuery.isLoading || teamsQuery.isLoading) return <AppPage title="Chargement..."><Spinner /></AppPage>;
  if (playerQuery.error) return <AppPage title="Erreur"><Alert variant="error">{playerQuery.error.message}</Alert></AppPage>;
  if (!player) return <AppPage title="Joueur non trouvé"><EmptyState title="Joueur non trouvé" /></AppPage>;

  return (
    <AppPage 
      title={`${player.firstname} ${player.lastname}`}
      description={`Fiche personnelle du joueur`}
      action={
        <div className="app-page__actions-row">
          {player.teamId && (
            <Link to={ROUTES.TEAM_DETAILS.replace(':id', player.teamId)} className="btn btn-secondary">
              Retour à l'équipe
            </Link>
          )}
          <Link to={ROUTES.PLAYERS} className="btn btn-secondary">
            Tous les joueurs
          </Link>
        </div>
      }
    >
      <div className="crud-page">
        <div className="dashboard-sections">
          <section className="dashboard-section">
            <h3>Informations personnelles</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-content">
                  <p><strong>Email</strong></p>
                  <span>{player.email || 'Non renseigné'}</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-content">
                  <p><strong>Téléphone</strong></p>
                  <span>{player.phoneNumber || 'Non renseigné'}</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-content">
                  <p><strong>Date de naissance</strong></p>
                  <span>{player.birthday ? new Date(player.birthday).toLocaleDateString() : 'Non renseignée'}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h3>Sport & Équipe</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-content">
                  <p><strong>Équipe</strong></p>
                  <span>
                    {team ? (
                      <Link to={ROUTES.TEAM_DETAILS.replace(':id', team.id)} className="table-link">
                        {team.name}
                      </Link>
                    ) : 'Aucune équipe'}
                  </span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-content">
                  <p><strong>Poste</strong></p>
                  <span>{player.position || 'Non défini'}</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-content">
                  <p><strong>Statut</strong></p>
                  <span>{player.status || 'Actif'}</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-content">
                  <p><strong>Note</strong></p>
                  <span>{player.rating ? `${player.rating} / 100` : 'Pas de note'}</span>
                </div>
              </div>
            </div>
          </section>

          {(player.emergencyName || player.emergencyEmail || player.emergencyPhoneNumber) && (
            <section className="dashboard-section">
              <h3>Contact d'urgence</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-content">
                    <p><strong>Nom</strong></p>
                    <span>{player.emergencyName || '—'}</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-content">
                    <p><strong>Email</strong></p>
                    <span>{player.emergencyEmail || '—'}</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-content">
                    <p><strong>Téléphone</strong></p>
                    <span>{player.emergencyPhoneNumber || '—'}</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </AppPage>
  );
};

export default PlayerDetailsPage;
