import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import Modal from '../../../components/ui/modals/Modal.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import * as teamApi from '../../../services/teamService.js';
import * as clubApi from '../../../services/clubService.js';
import AppPage from '../AppPage.jsx';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/routes.js';

const emptyForm = { name: '', category: '', season: '', clubId: '' };

const UNCATEGORIZED = '__none__';
const UNSEASONED = '__no_season__';

function seasonKey(team) {
  const s = team.season;
  if (s == null || s === '') {
    return '';
  }
  return String(s).trim();
}

/** Saison API (souvent AAAA-MM-JJ) → libellé affichage liste / filtre */
function formatSeasonOptionLabel(raw) {
  if (!raw) {
    return '';
  }
  const m = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) {
    return String(raw);
  }
  const [, y, mo, d] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  if (Number.isNaN(dt.getTime())) {
    return String(raw);
  }
  return dt.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function TeamsPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSeason, setFilterSeason] = useState('');

  const clubsQuery = useQuery({
    queryKey: ['clubs'],
    queryFn: clubApi.fetchClubs,
  });

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.fetchTeams,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        name: form.name.trim(),
        category: form.category.trim() || null,
        season: form.season.trim() || null,
        clubId: form.clubId ? Number(form.clubId) : null,
      };
      if (editing) {
        return teamApi.updateTeam(editing.id, body);
      }
      return teamApi.createTeam(body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teams'] });
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setFormError('');
    },
    onError: (e) => setFormError(e.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => teamApi.deleteTeam(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teams'] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (team) => {
    setEditing(team);
    setForm({
      name: team.name || '',
      category: team.category || '',
      season: team.season || '',
      clubId: team.clubId ? String(team.clubId) : '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const teams = teamsQuery.data?.items ?? [];

  const categoryOptions = useMemo(() => {
    const seen = new Set();
    for (const t of teams) {
      const c = (t.category ?? '').trim();
      if (c) {
        seen.add(c);
      }
    }
    return [...seen].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
  }, [teams]);

  const hasUncategorized = useMemo(
    () => teams.some((t) => !(t.category ?? '').trim()),
    [teams],
  );

  const seasonOptions = useMemo(() => {
    const seen = new Set();
    for (const t of teams) {
      const key = seasonKey(t);
      if (key) {
        seen.add(key);
      }
    }
    return [...seen].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [teams]);

  const hasNoSeason = useMemo(() => teams.some((t) => !seasonKey(t)), [teams]);

  const filteredTeams = useMemo(() => {
    let list = teams;
    if (filterCategory) {
      if (filterCategory === UNCATEGORIZED) {
        list = list.filter((t) => !(t.category ?? '').trim());
      } else {
        list = list.filter((t) => (t.category ?? '').trim() === filterCategory);
      }
    }
    if (filterSeason) {
      if (filterSeason === UNSEASONED) {
        list = list.filter((t) => !seasonKey(t));
      } else {
        list = list.filter((t) => seasonKey(t) === filterSeason);
      }
    }
    return list;
  }, [teams, filterCategory, filterSeason]);

  return (
    <AppPage
      title="Équipes"
      description="Créez et gérez vos équipes, catégories et saison."
    >
      <div className="teams-page crud-page">
        <div className="crud-toolbar">
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            + Nouvelle équipe
          </button>
          {teams.length > 0 ? (
            <>
              <select
                aria-label="Filtrer par catégorie"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {hasUncategorized ? (
                  <option value={UNCATEGORIZED}>Sans catégorie</option>
                ) : null}
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filtrer par saison"
                value={filterSeason}
                onChange={(e) => setFilterSeason(e.target.value)}
              >
                <option value="">Toutes les saisons</option>
                {hasNoSeason ? (
                  <option value={UNSEASONED}>Sans saison</option>
                ) : null}
                {seasonOptions.map((raw) => (
                  <option key={raw} value={raw}>
                    {formatSeasonOptionLabel(raw)}
                  </option>
                ))}
              </select>
            </>
          ) : null}
        </div>

        {teamsQuery.isLoading ? <Spinner /> : null}
        {teamsQuery.error ? (
          <Alert variant="error">{teamsQuery.error.message}</Alert>
        ) : null}

        {!teamsQuery.isLoading && teams.length === 0 ? (
          <EmptyState
            title="Aucune équipe"
            description="Créez une équipe pour commencer."
          />
        ) : null}

        {!teamsQuery.isLoading && teams.length > 0 && filteredTeams.length === 0 ? (
          <EmptyState
            title="Aucun résultat"
            description="Aucune équipe ne correspond aux filtres sélectionnés."
          />
        ) : null}

        {filteredTeams.length > 0 ? (
          <div className="crud-table-wrap">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Saison</th>
                  <th>Club</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((t) => (
                  <tr key={t.id}>
                    <td data-label="Nom">
                      <Link to={ROUTES.TEAM_DETAILS.replace(':id', t.id)} className="table-link">
                        {t.name}
                      </Link>
                    </td>
                    <td data-label="Catégorie">{t.category || '—'}</td>
                    <td data-label="Saison">{formatSeasonOptionLabel(seasonKey(t)) || '—'}</td>
                    <td data-label="Club">{t.clubId ?? '—'}</td>
                    <td data-label="Actions" className="crud-table__actions crud-table__actions--split">
                      <div className="crud-table__actions-start">
                        <Link
                          to={ROUTES.TEAM_ROLL_CALL.replace(':id', t.id)}
                          className="btn btn-primary btn-compact"
                        >
                          Appel
                        </Link>
                        <Link to={ROUTES.TEAM_DETAILS.replace(':id', t.id)} className="btn btn-secondary btn-compact">
                          Détails
                        </Link>
                      </div>
                      <div className="crud-table__actions-end">
                        <button type="button" className="btn btn-secondary btn-compact" onClick={() => openEdit(t)}>
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-compact"
                          onClick={() => {
                            if (window.confirm('Supprimer cette équipe ?')) {
                              deleteMutation.mutate(t.id);
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
        title={editing ? 'Modifier l’équipe' : 'Nouvelle équipe'}
      >
        <form
          className="app-form"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
        >
          {formError ? (
            <Alert variant="error">{formError}</Alert>
          ) : null}
          <div>
            <label>Nom</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Catégorie</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div>
            <label>Saison (AAAA-MM-JJ)</label>
            <input
              type="date"
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
            />
          </div>
          <div>
            <label>Club</label>
            <select
              value={form.clubId}
              onChange={(e) => setForm({ ...form, clubId: e.target.value })}
            >
              <option value="">—</option>
              {(clubsQuery.data?.items ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </Modal>
    </AppPage>
  );
}
