import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Modal from '../../../components/ui/modals/Modal.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import * as teamApi from '../../../services/teamService.js';
import * as clubApi from '../../../services/clubService.js';
import AppPage from '../AppPage.jsx';

import './teams.css';

const emptyForm = { name: '', category: '', season: '', clubId: '' };

export default function TeamsPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

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

  return (
    <AppPage
      title="Équipes"
      description="Créez et gérez vos équipes, catégories et saison."
    >
      <div className="teams-page crud-page">
        <div className="crud-toolbar">
          <button type="button" className="btn-primary" onClick={openCreate}>
            Nouvelle équipe
          </button>
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

        {teams.length > 0 ? (
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
                {teams.map((t) => (
                  <tr key={t.id}>
                    <td data-label="Nom">{t.name}</td>
                    <td data-label="Catégorie">{t.category || '—'}</td>
                    <td data-label="Saison">{t.season || '—'}</td>
                    <td data-label="Club">{t.clubId ?? '—'}</td>
                    <td data-label="Actions" className="crud-table__actions">
                      <button type="button" onClick={() => openEdit(t)}>
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => {
                          if (window.confirm('Supprimer cette équipe ?')) {
                            deleteMutation.mutate(t.id);
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
        title={editing ? 'Modifier l’équipe' : 'Nouvelle équipe'}
      >
        <form
          className="crud-form"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
        >
          {formError ? (
            <Alert variant="error">{formError}</Alert>
          ) : null}
          <label>
            Nom
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Catégorie
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </label>
          <label>
            Saison (AAAA-MM-JJ)
            <input
              type="date"
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
            />
          </label>
          <label>
            Club
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
          </label>
          <div className="crud-form__actions">
            <button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>
    </AppPage>
  );
}
