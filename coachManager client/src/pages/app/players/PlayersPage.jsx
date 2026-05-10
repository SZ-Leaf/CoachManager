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
import { formatPlayerPosition, PLAYER_POSITIONS } from '../../../utils/playerPosition.js';
import { PLAYER_STATUSES } from '../../../utils/playerStatus.js';
import { playerToFormInitialValues } from '../../../utils/playerFormValues.js';

function comparePlayersByName(a, b) {
  const last = a.lastname.localeCompare(b.lastname, 'fr', { sensitivity: 'base' });
  if (last !== 0) {
    return last;
  }
  return a.firstname.localeCompare(b.firstname, 'fr', { sensitivity: 'base' });
}

export default function PlayersPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [formError, setFormError] = useState('');
  const [nameSort, setNameSort] = useState('asc');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTeamId, setFilterTeamId] = useState('');

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.fetchTeams,
  });

  const playersQuery = useQuery({
    queryKey: ['players'],
    queryFn: playerApi.fetchPlayers,
  });

  const initialValues = useMemo(() => playerToFormInitialValues(detail), [detail]);

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editingId
        ? playerApi.updatePlayer(editingId, payload)
        : playerApi.createPlayer(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['players'] });
      if (editingId != null) {
        qc.invalidateQueries({ queryKey: ['player', String(editingId)] });
      }
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

  const teamsSorted = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })),
    [teams],
  );

  const filteredPlayers = useMemo(() => {
    let list = [...players];
    if (filterPosition) {
      list = list.filter((p) => String(p.position ?? '') === filterPosition);
    }
    if (filterStatus) {
      list = list.filter((p) => String(p.status ?? '') === filterStatus);
    }
    if (filterTeamId) {
      list = list.filter((p) => String(p.teamId ?? '') === filterTeamId);
    }
    list.sort((a, b) => (nameSort === 'asc' ? comparePlayersByName(a, b) : comparePlayersByName(b, a)));
    return list;
  }, [players, filterPosition, filterStatus, filterTeamId, nameSort]);

  const hasActiveFilters = Boolean(filterPosition || filterStatus || filterTeamId || nameSort !== 'asc');

  const resetFilters = () => {
    setNameSort('asc');
    setFilterPosition('');
    setFilterStatus('');
    setFilterTeamId('');
  };

  return (
    <AppPage
      title="Joueurs"
      description="Fiches joueurs liées à vos équipes."
    >
      <div className="players-page crud-page">
        <div className="crud-toolbar players-page__toolbar">
          <div className="players-page__toolbar-strip">
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              + Nouveau joueur
            </button>
            <select
              aria-label="Tri par ordre alphabétique"
              value={nameSort}
              onChange={(e) => setNameSort(e.target.value)}
            >
              <option value="asc">Nom : A → Z</option>
              <option value="desc">Nom : Z → A</option>
            </select>
            <select
              aria-label="Filtrer par poste"
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
            >
              <option value="">Tous les postes</option>
              {PLAYER_POSITIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Filtrer par statut"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              {PLAYER_STATUSES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Filtrer par équipe"
              value={filterTeamId}
              onChange={(e) => setFilterTeamId(e.target.value)}
            >
              <option value="">Toutes les équipes</option>
              {teamsSorted.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.name}
                </option>
              ))}
            </select>
            {hasActiveFilters ? (
              <button
                type="button"
                className="btn btn-secondary players-page__reset-btn"
                onClick={resetFilters}
                aria-label="Réinitialiser les filtres"
                title="Réinitialiser les filtres"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            ) : null}
          </div>
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

        {!playersQuery.isLoading && players.length > 0 && filteredPlayers.length === 0 ? (
          <EmptyState
            title="Aucun résultat"
            description="Aucun joueur ne correspond aux filtres sélectionnés."
          />
        ) : null}

        {filteredPlayers.length > 0 ? (
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
                {filteredPlayers.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Nom">
                      <Link to={ROUTES.PLAYER_DETAILS.replace(':id', p.id)} className="table-link">
                        {p.firstname} {p.lastname}
                      </Link>
                    </td>
                    <td data-label="Équipe">
                      {p.teamId
                        ? teams.find((t) => String(t.id) === String(p.teamId))?.name ?? '—'
                        : '—'}
                    </td>
                    <td data-label="Poste">{formatPlayerPosition(p.position) || '—'}</td>
                    <td data-label="Actions" className="crud-table__actions crud-table__actions--split">
                      <div className="crud-table__actions-start">
                        <Link to={ROUTES.PLAYER_DETAILS.replace(':id', p.id)} className="btn btn-secondary btn-compact">
                          Détails
                        </Link>
                      </div>
                      <div className="crud-table__actions-end">
                        <button type="button" className="btn btn-secondary btn-compact" onClick={() => openEdit(p.id)}>
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-compact"
                          onClick={() => {
                            if (window.confirm('Supprimer ce joueur ?')) {
                              deleteMutation.mutate(p.id);
                            }
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
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
