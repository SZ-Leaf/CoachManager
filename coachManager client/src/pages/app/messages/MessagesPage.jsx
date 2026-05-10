import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { CrudListShell } from '../../../components/common/index.js';
import Modal from '../../../components/ui/modals/Modal.jsx';
import MessageForm from '../../../components/ui/forms/communication/MessageForm.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import * as messagesApi from '../../../services/messagesService.js';
import * as playerApi from '../../../services/playerService.js';
import AppPage from '../AppPage.jsx';
import { useCrudModal } from '../../../hooks/useCrudModal.js';

const empty = {
  playerId: '',
  recipientType: 'player',
  recipientEmail: '',
  subject: '',
  body: '',
  status: '',
};

export default function MessagesPage() {
  const qc = useQueryClient();
  const modal = useCrudModal();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);

  const playersQuery = useQuery({
    queryKey: ['players'],
    queryFn: playerApi.fetchPlayers,
  });

  const listQuery = useQuery({
    queryKey: ['messages'],
    queryFn: messagesApi.fetchMessages,
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = {
        playerId: Number(form.playerId),
        recipientType: form.recipientType || null,
        recipientEmail: form.recipientEmail || null,
        subject: form.subject || null,
        body: form.body || null,
        status: form.status || null,
      };
      if (editingId) {
        return messagesApi.updateMessage(editingId, body);
      }
      return messagesApi.createMessage(body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages'] });
      modal.closeModal();
      setEditingId(null);
      setForm(empty);
    },
    onError: (e) => modal.setFormError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => messagesApi.deleteMessage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(empty);
    modal.openModal();
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      playerId: String(row.playerId ?? ''),
      recipientType: row.recipientType || 'player',
      recipientEmail: row.recipientEmail || '',
      subject: row.subject || '',
      body: row.body || '',
      status: row.status || '',
    });
    modal.openModal();
  };

  const rows = listQuery.data?.items ?? [];
  const players = playersQuery.data?.items ?? [];

  return (
    <AppPage title="Messages" description="Communications liées à vos joueurs.">
      <div className="crud-page">
        <div className="crud-toolbar">
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            + Nouveau message
          </button>
        </div>

        <CrudListShell
          isLoading={listQuery.isLoading}
          error={listQuery.error}
          whenInitialEmpty={rows.length === 0}
          initialEmptyContent={<EmptyState title="Aucun message" />}
          whenFilteredEmpty={false}
          filteredEmptyContent={null}
          hasRows={rows.length > 0}
        >
          <div className="crud-table-wrap">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Joueur</th>
                  <th>Sujet</th>
                  <th>Statut</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id}>
                    <td data-label="Joueur">{m.playerId}</td>
                    <td data-label="Sujet">{m.subject || '—'}</td>
                    <td data-label="Statut">{m.status || '—'}</td>
                    <td data-label="Actions" className="crud-table__actions">
                      <button type="button" className="btn btn-secondary btn-compact" onClick={() => openEdit(m)}>
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-compact"
                        onClick={() => {
                          if (window.confirm('Supprimer ?')) {
                            deleteMutation.mutate(m.id);
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
        title={editingId ? 'Modifier le message' : 'Nouveau message'}
      >
        <MessageForm
          form={form}
          setForm={setForm}
          players={players}
          formError={modal.formError}
          isPending={saveMutation.isPending}
          onSubmit={() => saveMutation.mutate()}
        />
      </Modal>
    </AppPage>
  );
}
