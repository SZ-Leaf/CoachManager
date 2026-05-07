import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Modal from '../../../components/ui/modals/Modal.jsx';
import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import * as attendanceApi from '../../../services/attendanceService.js';
import * as playerApi from '../../../services/playerService.js';
import AppPage from '../AppPage.jsx';

import '../teams/teams.css';

const STATUSES = [
  { value: 'present', label: 'Présent' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Retard' },
  { value: 'excused', label: 'Excusé' },
];

const empty = { playerId: '', date: '', status: '', comment: '' };

export default function AttendancePage() {
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
    queryKey: ['attendances'],
    queryFn: attendanceApi.fetchAttendances,
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = {
        playerId: Number(form.playerId),
        date: form.date || null,
        status: form.status || null,
        comment: form.comment || null,
      };
      if (editingId) {
        return attendanceApi.updateAttendance(editingId, body);
      }
      return attendanceApi.createAttendance(body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendances'] });
      setModalOpen(false);
      setEditingId(null);
      setForm(empty);
      setFormError('');
    },
    onError: (e) => setFormError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => attendanceApi.deleteAttendance(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendances'] }),
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
      date: row.date ? String(row.date).slice(0, 10) : '',
      status: row.status || '',
      comment: row.comment || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const rows = listQuery.data?.items ?? [];
  const players = playersQuery.data?.items ?? [];

  return (
    <AppPage title="Présences" description="Feuilles de présence par joueur.">
      <div className="crud-page">
        <div className="crud-toolbar">
          <button type="button" className="btn-primary" onClick={openCreate}>
            Nouvelle présence
          </button>
        </div>

        {listQuery.isLoading ? <Spinner /> : null}
        {listQuery.error ? (
          <Alert variant="error">{listQuery.error.message}</Alert>
        ) : null}

        {!listQuery.isLoading && rows.length === 0 ? (
          <EmptyState title="Aucune présence" />
        ) : null}

        {rows.length > 0 ? (
          <div className="crud-table-wrap">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Joueur</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td data-label="Joueur">{a.playerId}</td>
                    <td data-label="Date">{a.date ? String(a.date).slice(0, 10) : '—'}</td>
                    <td data-label="Statut">{a.status || '—'}</td>
                    <td data-label="Actions" className="crud-table__actions">
                      <button type="button" onClick={() => openEdit(a)}>
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => {
                          if (window.confirm('Supprimer ?')) {
                            deleteMutation.mutate(a.id);
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
        title={editingId ? 'Modifier' : 'Nouvelle présence'}
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
            Date
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          <label>
            Statut
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="">—</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Commentaire
            <input
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
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
