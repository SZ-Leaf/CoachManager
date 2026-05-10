import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { CrudListShell, CrudToolbarStrip } from '../../../components/common/index.js';
import Modal from '../../../components/ui/modals/Modal.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import PlayerForm from '../../../components/ui/forms/player/PlayerForm.jsx';
import { useCrudModal } from '../../../hooks/useCrudModal.js';
import * as playerApi from '../../../services/playerService.js';
import * as teamApi from '../../../services/teamService.js';
import AppPage from '../AppPage.jsx';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/routes.js';
import { formatPlayerPosition, PLAYER_POSITIONS } from '../../../utils/playerPosition.js';
import { formatPlayerStatus, PLAYER_STATUSES } from '../../../utils/playerStatus.js';
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
  const modal = useCrudModal();
  const [editingId, setEditingId] = useState(null);
  const [detail, setDetail] = useState(null);
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
      editingId ? playerApi.updatePlayer(editingId, payload) : playerApi.createPlayer(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['players'] });
      if (editingId != null) {
        qc.invalidateQueries({ queryKey: ['player', String(editingId)] });
      }
      modal.closeModal();
      setEditingId(null);
      setDetail(null);
    },
    onError: (e) => modal.setFormError(e.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => playerApi.deletePlayer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['players'] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setDetail({});
    modal.openModal();
  };

  const openEdit = async (id) => {
    modal.setFormError('');
    setEditingId(id);
    try {
      const res = await playerApi.fetchPlayer(id);
      setDetail(res.player);
      modal.openModal();
    } catch (e) {
      modal.setFormError(e.message);
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
    <AppPage title="Joueurs" description="Fiches joueurs liées à vos équipes.">
      <div className="players-page crud-page">
        <div className="crud-toolbar crud-toolbar--full-width">
          <CrudToolbarStrip showReset={hasActiveFilters} onReset={resetFilters}>
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
          </CrudToolbarStrip>
        </div>

        <CrudListShell
          isLoading={playersQuery.isLoading}
          error={playersQuery.error}
          whenInitialEmpty={players.length === 0}
          initialEmptyContent={
            <EmptyState title="Aucun joueur" description="Ajoutez un joueur à l’une de vos équipes." />
          }
          whenFilteredEmpty={players.length > 0 && filteredPlayers.length === 0}
          filteredEmptyContent={
            <EmptyState
              title="Aucun résultat"
              description="Aucun joueur ne correspond aux filtres sélectionnés."
            />
          }
          hasRows={filteredPlayers.length > 0}
        >
          <div className="crud-table-wrap">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Équipe</th>
                  <th>Poste</th>
                  <th>Statut</th>
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
                    <td data-label="Statut">{formatPlayerStatus(p.status) || '—'}</td>
                    <td data-label="Actions" className="crud-table__actions crud-table__actions--split">
                      <div className="crud-table__actions-start">
                        <Link
                          to={ROUTES.PLAYER_DETAILS.replace(':id', p.id)}
                          className="btn btn-secondary btn-compact"
                        >
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
        </CrudListShell>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={editingId ? 'Modifier le joueur' : 'Nouveau joueur'}
      >
        {modal.formError ? <Alert variant="error">{modal.formError}</Alert> : null}
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
