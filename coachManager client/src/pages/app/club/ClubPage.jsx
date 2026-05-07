import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Modal from '../../../components/ui/modals/Modal.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import * as clubApi from '../../../services/clubService.js';
import AppPage from '../AppPage.jsx';

import '../teams/teams.css';

const DISCIPLINES = [
  'football',
  'basketball',
  'rugby',
  'tennis',
  'volleyball',
  'handball',
  'other',
];

const emptyForm = { name: '', discipline: '', logo: '', description: '' };

export default function ClubPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const clubsQuery = useQuery({
    queryKey: ['clubs'],
    queryFn: clubApi.fetchClubs,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        name: form.name.trim(),
        discipline: form.discipline || null,
        logo: form.logo.trim() || null,
        description: form.description.trim() || null,
      };
      if (editing) {
        return clubApi.updateClub(editing.id, body);
      }
      return clubApi.createClub(body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clubs'] });
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setFormError('');
    },
    onError: (e) => setFormError(e.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => clubApi.deleteClub(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clubs'] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (club) => {
    setEditing(club);
    setForm({
      name: club.name || '',
      discipline: club.discipline || '',
      logo: club.logo || '',
      description: club.description || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const clubs = clubsQuery.data?.items ?? [];

  return (
    <AppPage
      title="Club"
      description="Vos clubs (créés par vous) pour rattacher des équipes."
    >
      <div className="crud-page">
        <div className="crud-toolbar">
          <button type="button" className="btn-primary" onClick={openCreate}>
            Nouveau club
          </button>
        </div>

        {clubsQuery.isLoading ? <Spinner /> : null}
        {clubsQuery.error ? (
          <Alert variant="error">{clubsQuery.error.message}</Alert>
        ) : null}

        {!clubsQuery.isLoading && clubs.length === 0 ? (
          <EmptyState
            title="Aucun club"
            description="Créez un club puis associez-le à une équipe."
          />
        ) : null}

        {clubs.length > 0 ? (
          <div className="crud-table-wrap">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Discipline</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {clubs.map((c) => (
                  <tr key={c.id}>
                    <td data-label="Nom">{c.name}</td>
                    <td data-label="Discipline">{c.discipline || '—'}</td>
                    <td data-label="Actions" className="crud-table__actions">
                      <button type="button" onClick={() => openEdit(c)}>
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => {
                          if (window.confirm('Supprimer ce club ?')) {
                            deleteMutation.mutate(c.id);
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
        title={editing ? 'Modifier le club' : 'Nouveau club'}
      >
        <form
          className="crud-form"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
        >
          {formError ? <Alert variant="error">{formError}</Alert> : null}
          <label>
            Nom *
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Discipline
            <select
              value={form.discipline}
              onChange={(e) => setForm({ ...form, discipline: e.target.value })}
            >
              <option value="">—</option>
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label>
            Logo (URL)
            <input
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
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
