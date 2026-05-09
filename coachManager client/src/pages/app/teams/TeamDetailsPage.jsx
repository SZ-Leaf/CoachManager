import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import * as teamApi from '../../../services/teamService.js';
import * as playerApi from '../../../services/playerService.js';
import AppPage from '../AppPage.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import { ROUTES } from '../../../utils/routes.js';

const TeamDetailsPage = () => {
  const { id } = useParams();

  const teamQuery = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamApi.fetchTeam(id),
  });

  const playersQuery = useQuery({
    queryKey: ['players'],
    queryFn: playerApi.fetchPlayers,
  });

  const team = teamQuery.data?.item || teamQuery.data;
  const allPlayers = playersQuery.data?.items || [];
  const teamPlayers = allPlayers.filter(p => String(p.teamId) === String(id));

  if (teamQuery.isLoading || playersQuery.isLoading) return <AppPage title="Chargement..."><Spinner /></AppPage>;
  if (teamQuery.error) return <AppPage title="Erreur"><Alert variant="error">{teamQuery.error.message}</Alert></AppPage>;
  if (!team) return <AppPage title="Équipe non trouvée"><EmptyState title="Équipe non trouvée" /></AppPage>;

  return (
    <AppPage 
      title={`Équipe : ${team.name}`}
      description={`${team.category || 'Sans catégorie'} — Saison ${team.season || 'N/A'}`}
      action={
        <Link to={ROUTES.TEAMS} className="btn btn-secondary">
          Retour aux équipes
        </Link>
      }
    >
      <div className="crud-page">
        <section className="app-page__content">
          <h3 style={{ marginBottom: '16px' }}>Joueurs de l'équipe</h3>
          
          {teamPlayers.length === 0 ? (
            <EmptyState title="Aucun joueur" description="Il n'y a pas encore de joueurs rattachés à cette équipe." />
          ) : (
            <div className="crud-table-wrap">
              <table className="crud-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Poste</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {teamPlayers.map((p) => (
                    <tr key={p.id}>
                      <td data-label="Nom">
                        <Link to={ROUTES.PLAYER_DETAILS.replace(':id', p.id)} style={{ color: 'var(--primary)', fontWeight: '600' }}>
                          {p.firstname} {p.lastname}
                        </Link>
                      </td>
                      <td data-label="Poste">{p.position || '—'}</td>
                      <td data-label="Statut">{p.status || '—'}</td>
                      <td data-label="Actions" className="crud-table__actions">
                        <Link to={ROUTES.PLAYER_DETAILS.replace(':id', p.id)} className="btn btn-secondary" style={{ minHeight: '32px', padding: '0 12px', fontSize: '0.8125rem' }}>
                          Voir fiche
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppPage>
  );
};

export default TeamDetailsPage;
