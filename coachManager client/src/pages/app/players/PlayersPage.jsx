import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import Modal from '../../../components/ui/modals/Modal.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import PlayerForm from '../../../components/ui/forms/player/PlayerForm.jsx';
import * as playerApi from '../../../services/playerService.js';
import * as teamApi from '../../../services/teamService.js';
import AppPage from '../AppPage.jsx';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/routes.js';

import '../teams/teams.css';

function birthdayInputValue(iso) {
  if (!iso) return '';
  return String(iso).slice(0, 10);
}

export default function PlayersPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [formError, setFormError] = useState('');

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.fetchTeams,
  });

  const playersQuery = useQuery({
    queryKey: ['players'],
    queryFn: playerApi.fetchPlayers,
  });

  const initialValues = useMemo(() => {
    if (!detail) {
      return {};
    }
    return {
      firstname: detail.firstname || '',
      lastname: detail.lastname || '',
      email: detail.email || '',
      phoneNumber: detail.phoneNumber || '',
      birthday: birthdayInputValue(detail.birthday),
      avatar: detail.avatar || '',
      position: detail.position || '',
      status: detail.status || '',
      rating: detail.rating ?? '',
      emergencyName: detail.emergencyName || '',
      emergencyEmail: detail.emergencyEmail || '',
      emergencyPhoneNumber: detail.emergencyPhoneNumber || '',
      teamId: detail.teamId ? String(detail.teamId) : '',
    };
  }, [detail]);

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editingId
        ? playerApi.updatePlayer(editingId, payload)
        : playerApi.createPlayer(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['players'] });
      setModalOpen(false);
      setEditingId(null);
      setDetail(null);
      setFormError('');
    },
    onError: (e) => setFormError(e.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => playerApi.deletePlayer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['players'] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setDetail({});
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    setFormError('');
    setEditingId(id);
    try {
      const res = await playerApi.fetchPlayer(id);
      setDetail(res.player);
      setModalOpen(true);
    } catch (e) {
      setFormError(e.message);
    }
  };

  const players = playersQuery.data?.items ?? [];
  const teams = teamsQuery.data?.items ?? [];

  return (
    <AppPage
      title="Joueurs"
      description="Fiches joueurs liées à vos équipes."
    >
      <div className="players-page crud-page">
        <div className="crud-toolbar">
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            + Nouveau joueur
          </button>
        </div>

        {playersQuery.isLoading ? <Spinner /> : null}
        {playersQuery.error ? (
          <Alert variant="error">{playersQuery.error.message}</Alert>
        ) : null}

        {!playersQuery.isLoading && players.length === 0 ? (
          <EmptyState
            title="Aucun joueur"
            description="Ajoutez un joueur à l’une de vos équipes."
          />
        ) : null}

        {players.length > 0 ? (
          <div className="crud-table-wrap">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Équipe</th>
                  <th>Poste</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Nom">
                      <Link to={ROUTES.PLAYER_DETAILS.replace(':id', p.id)} style={{ color: 'var(--primary)', fontWeight: '600' }}>
                        {p.firstname} {p.lastname}
                      </Link>
                    </td>
                    <td data-label="Équipe">{p.teamId ?? '—'}</td>
                    <td data-label="Poste">{p.position || '—'}</td>
                    <td data-label="Actions" className="crud-table__actions">
                      <Link to={ROUTES.PLAYER_DETAILS.replace(':id', p.id)} className="btn btn-secondary" style={{ minHeight: '32px', padding: '0 12px', fontSize: '0.8125rem' }}>
                        Détails
                      </Link>
                      <button type="button" className="btn btn-secondary" style={{ minHeight: '32px', padding: '0 12px', fontSize: '0.8125rem' }} onClick={() => openEdit(p.id)}>
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{ minHeight: '32px', padding: '0 12px', fontSize: '0.8125rem' }}
                        onClick={() => {
                          if (window.confirm('Supprimer ce joueur ?')) {
                            deleteMutation.mutate(p.id);
                          }
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Modifier le joueur' : 'Nouveau joueur'}
      >
        {formError ? <Alert variant="error">{formError}</Alert> : null}
        <PlayerForm
          teams={teams}
          initialValues={initialValues}
          isSubmitting={saveMutation.isPending}
          serverErrors={[]}
          onSubmit={(payload) => saveMutation.mutate(payload)}
        />
      </Modal>
    </AppPage>
  );
}
