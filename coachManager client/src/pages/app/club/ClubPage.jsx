import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { CrudListShell } from '../../../components/common/index.js';
import Modal from '../../../components/ui/modals/Modal.jsx';
import ClubForm from '../../../components/ui/forms/club/ClubForm.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import * as clubApi from '../../../services/clubService.js';
import AppPage from '../AppPage.jsx';
import { useCrudModal } from '../../../hooks/useCrudModal.js';

const emptyForm = { name: '', discipline: '', logo: '', description: '' };

export default function ClubPage() {
  const qc = useQueryClient();
  const modal = useCrudModal();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

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
      modal.closeModal();
      setEditing(null);
      setForm(emptyForm);
    },
    onError: (e) => modal.setFormError(e.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => clubApi.deleteClub(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clubs'] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    modal.openModal();
  };

  const openEdit = (club) => {
    setEditing(club);
    setForm({
      name: club.name || '',
      discipline: club.discipline || '',
      logo: club.logo || '',
      description: club.description || '',
    });
    modal.openModal();
  };

  const clubs = clubsQuery.data?.items ?? [];

  return (
    <AppPage title="Club" description="Vos clubs (créés par vous) pour rattacher des équipes.">
      <div className="crud-page">
        <div className="crud-toolbar">
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            + Nouveau club
          </button>
        </div>

        <CrudListShell
          isLoading={clubsQuery.isLoading}
          error={clubsQuery.error}
          whenInitialEmpty={clubs.length === 0}
          initialEmptyContent={
            <EmptyState title="Aucun club" description="Créez un club puis associez-le à une équipe." />
          }
          whenFilteredEmpty={false}
          filteredEmptyContent={null}
          hasRows={clubs.length > 0}
        >
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
                      <button type="button" className="btn btn-secondary btn-compact" onClick={() => openEdit(c)}>
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-compact"
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
        </CrudListShell>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title={editing ? 'Modifier le club' : 'Nouveau club'}
      >
        <ClubForm
          form={form}
          setForm={setForm}
          formError={modal.formError}
          isPending={saveMutation.isPending}
          onSubmit={() => saveMutation.mutate()}
        />
      </Modal>
    </AppPage>
  );
}
