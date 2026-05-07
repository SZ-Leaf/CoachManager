import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Modal from '../../../components/ui/modals/Modal.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import * as messagesApi from '../../../services/messagesService.js';
import * as playerApi from '../../../services/playerService.js';
import AppPage from '../AppPage.jsx';

import '../teams/teams.css';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');

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
      setModalOpen(false);
      setEditingId(null);
      setForm(empty);
      setFormError('');
    },
    onError: (e) => setFormError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => messagesApi.deleteMessage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(empty);
    setFormError('');
    setModalOpen(true);
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
    setFormError('');
    setModalOpen(true);
  };

  const rows = listQuery.data?.items ?? [];
  const players = playersQuery.data?.items ?? [];

  return (
    <AppPage title="Messages" description="Communications liées à vos joueurs.">
      <div className="crud-page">
        <div className="crud-toolbar">
          <button type="button" className="btn-primary" onClick={openCreate}>
            Nouveau message
          </button>
        </div>

        {listQuery.isLoading ? <Spinner /> : null}
        {listQuery.error ? (
          <Alert variant="error">{listQuery.error.message}</Alert>
        ) : null}

        {!listQuery.isLoading && rows.length === 0 ? (
          <EmptyState title="Aucun message" />
        ) : null}

        {rows.length > 0 ? (
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
                      <button type="button" onClick={() => openEdit(m)}>
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
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
        ) : null}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Modifier le message' : 'Nouveau message'}
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
            Joueur *
            <select
              value={form.playerId}
              onChange={(e) => setForm({ ...form, playerId: e.target.value })}
              required
            >
              <option value="">—</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstname} {p.lastname}
                </option>
              ))}
            </select>
          </label>
          <label>
            Destinataire
            <select
              value={form.recipientType}
              onChange={(e) =>
                setForm({ ...form, recipientType: e.target.value })
              }
            >
              <option value="player">Joueur</option>
              <option value="emergency">Urgence</option>
            </select>
          </label>
          <label>
            Email destinataire
            <input
              type="email"
              value={form.recipientEmail}
              onChange={(e) =>
                setForm({ ...form, recipientEmail: e.target.value })
              }
            />
          </label>
          <label>
            Sujet
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </label>
          <label>
            Corps
            <textarea
              rows={4}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </label>
          <label>
            Statut
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="">—</option>
              <option value="sent">Envoyé</option>
              <option value="failed">Échec</option>
            </select>
          </label>
          <div className="crud-form__actions">
            <button type="submit" disabled={saveMutation.isPending}>
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>
    </AppPage>
  );
}
