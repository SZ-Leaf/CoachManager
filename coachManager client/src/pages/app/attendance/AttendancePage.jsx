import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import Modal from '../../../components/ui/modals/Modal.jsx';
import * as attendanceApi from '../../../services/attendanceService.js';
import * as teamApi from '../../../services/teamService.js';
import AppPage from '../AppPage.jsx';
import { ROUTES } from '../../../utils/routes.js';
import { ATTENDANCE_STATUS_OPTIONS } from '../../../utils/attendanceStatuses.js';
import { formatSeasonSportsRange } from '../../../utils/teamSeason.js';
import '../../../styles/pages/attendance-hub.css';

function formatSessionDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeSessionsPayload(data) {
  const raw = data?.sessions;
  if (!Array.isArray(raw)) return [];
  return raw.filter((s) => s && s.teamId != null && typeof s.sessionAt === 'string');
}

function sessionModalKey(teamId, sessionAt) {
  return `${teamId}::${sessionAt}`;
}

function parseSessionModalKey(key) {
  if (!key) return null;
  const sep = key.indexOf('::');
  if (sep === -1) return null;
  return {
    teamId: key.slice(0, sep),
    sessionAt: key.slice(sep + 2),
  };
}

export default function AttendancePage() {
  const qc = useQueryClient();
  const [teamFilter, setTeamFilter] = useState('');
  const [modalKey, setModalKey] = useState(null);
  const [sessionFeedback, setSessionFeedback] = useState(null);

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.fetchTeams,
  });

  const teams = teamsQuery.data?.items ?? [];

  const sessionsQuery = useQuery({
    queryKey: ['rollCallSessions'],
    queryFn: attendanceApi.fetchRollCallSessions,
    enabled: teamsQuery.isSuccess && teams.length > 0,
  });

  const sessions = useMemo(() => normalizeSessionsPayload(sessionsQuery.data), [sessionsQuery.data]);

  const filteredSessions = useMemo(() => {
    if (!teamFilter) return sessions;
    return sessions.filter((s) => String(s.teamId) === teamFilter);
  }, [sessions, teamFilter]);

  const modalSession = useMemo(() => {
    const parsed = parseSessionModalKey(modalKey);
    if (!parsed) return null;
    return (
      sessions.find(
        (s) => String(s.teamId) === parsed.teamId && s.sessionAt === parsed.sessionAt,
      ) ?? null
    );
  }, [modalKey, sessions]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ attendanceId, status }) =>
      attendanceApi.updateAttendance(attendanceId, { status }),
    onMutate: () => {
      setSessionFeedback(null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rollCallSessions'] });
      qc.invalidateQueries({ queryKey: ['attendances'] });
      qc.invalidateQueries({ queryKey: ['teamRollCall'] });
      setSessionFeedback({ variant: 'success', text: 'Statut mis à jour.' });
    },
    onError: (e) => {
      setSessionFeedback({ variant: 'error', text: e.message || 'Mise à jour impossible.' });
    },
  });

  const summaryLine = (counts) => {
    if (!counts || typeof counts !== 'object') return '—';
    const parts = [];
    if (counts.present) parts.push(`${counts.present} présent${counts.present > 1 ? 's' : ''}`);
    if (counts.absent) parts.push(`${counts.absent} absent${counts.absent > 1 ? 's' : ''}`);
    if (counts.late) parts.push(`${counts.late} retard`);
    if (counts.excused) parts.push(`${counts.excused} excusé${counts.excused > 1 ? 's' : ''}`);
    return parts.length ? parts.join(' · ') : 'Répartition vide';
  };

  return (
    <AppPage
      title="Appels / présences"
      description="Feuilles d’appel par équipe, historique des séances et correction du statut d’un joueur."
    >
      <div className="attendance-hub">
        {teamsQuery.isLoading ? <Spinner /> : null}
        {teamsQuery.error ? (
          <Alert variant="error">{teamsQuery.error.message}</Alert>
        ) : null}

        {!teamsQuery.isLoading && teams.length === 0 ? (
          <EmptyState
            title="Aucune équipe"
            description="Créez une équipe pour pouvoir faire l’appel."
            action={
              <Link to={ROUTES.TEAMS} className="btn btn-primary">
                Gérer les équipes
              </Link>
            }
          />
        ) : null}

        {teams.length > 0 ? (
          <>
            <section aria-labelledby="attendance-teams-heading">
              <h2 id="attendance-teams-heading" className="attendance-hub__section-title">
                Nouvel appel
              </h2>
              <ul className="attendance-hub__list">
                {teams.map((t) => (
                  <li key={t.id} className="attendance-hub__card">
                    <div className="attendance-hub__card-main">
                      <h3 className="attendance-hub__team-name">{t.name}</h3>
                      <p className="attendance-hub__team-meta">
                        {[t.category, formatSeasonSportsRange(t.season)].filter(Boolean).join(' · ') ||
                          'Équipe'}
                      </p>
                    </div>
                    <div className="attendance-hub__card-actions">
                      <Link
                        to={ROUTES.TEAM_ROLL_CALL.replace(':id', String(t.id))}
                        className="btn btn-primary"
                      >
                        Faire l’appel
                      </Link>
                      <Link
                        to={ROUTES.TEAM_DETAILS.replace(':id', String(t.id))}
                        className="btn btn-secondary btn-sm"
                      >
                        Détails
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="attendance-hub__history" aria-labelledby="attendance-history-heading">
              <div className="attendance-hub__history-head">
                <h2 id="attendance-history-heading" className="attendance-hub__section-title">
                  Historique des appels
                </h2>
                <label className="attendance-hub__filter">
                  <span className="sr-only">Filtrer par équipe</span>
                  <select
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                    aria-label="Filtrer par équipe"
                  >
                    <option value="">Toutes les équipes</option>
                    {teams.map((t) => (
                      <option key={t.id} value={String(t.id)}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {sessionsQuery.isLoading ? (
                <Spinner label="Chargement de l’historique…" />
              ) : null}
              {sessionsQuery.error ? (
                <Alert variant="error">{sessionsQuery.error.message}</Alert>
              ) : null}

              {!sessionsQuery.isLoading &&
              !sessionsQuery.error &&
              filteredSessions.length === 0 ? (
                <EmptyState
                  title="Aucun appel enregistré"
                  description="Les séances enregistrées apparaîtront ici après un premier appel."
                />
              ) : null}

              {!sessionsQuery.isLoading && filteredSessions.length > 0 ? (
                <div className="attendance-hub__history-table-wrap">
                  <table className="attendance-hub__history-table">
                    <thead>
                      <tr>
                        <th scope="col">Séance</th>
                        <th scope="col">Équipe</th>
                        <th scope="col">Résumé</th>
                        <th scope="col">Joueurs</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.map((s) => (
                        <tr key={sessionModalKey(s.teamId, s.sessionAt)}>
                          <td data-label="Séance">{formatSessionDate(s.sessionAt)}</td>
                          <td data-label="Équipe">{s.teamName ?? '—'}</td>
                          <td data-label="Résumé">{summaryLine(s.counts)}</td>
                          <td data-label="Joueurs">{Array.isArray(s.entries) ? s.entries.length : 0}</td>
                          <td data-label="Actions">
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setSessionFeedback(null);
                                setModalKey(sessionModalKey(s.teamId, s.sessionAt));
                              }}
                            >
                              Consulter / modifier
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          </>
        ) : null}
      </div>

      <Modal
        isOpen={Boolean(modalKey)}
        onClose={() => {
          setModalKey(null);
          setSessionFeedback(null);
        }}
        title={
          modalSession
            ? `Appel — ${modalSession.teamName ?? ''} (${formatSessionDate(modalSession.sessionAt)})`
            : 'Détail de l’appel'
        }
      >
        {modalKey && modalSession ? (
          <>
            {sessionFeedback ? (
              <Alert
                variant={sessionFeedback.variant}
                onDismiss={() => setSessionFeedback(null)}
              >
                {sessionFeedback.text}
              </Alert>
            ) : null}
            <p className="attendance-hub__modal-hint">
              Modifiez uniquement le statut d’un joueur ; les autres informations ne sont pas éditables ici.
            </p>
            <div className="attendance-hub__modal-table-wrap">
              <table className="attendance-hub__modal-table">
                <thead>
                  <tr>
                    <th scope="col">Joueur</th>
                    <th scope="col">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {(modalSession.entries ?? []).map((row) => (
                    <tr key={row.attendanceId ?? `${row.playerId}-${row.lastname}`}>
                      <td data-label="Joueur">
                        {row.firstname} {row.lastname}
                      </td>
                      <td data-label="Statut">
                        <label className="sr-only" htmlFor={`hist-status-${row.attendanceId}`}>
                          Statut pour {row.firstname} {row.lastname}
                        </label>
                        <select
                          id={`hist-status-${row.attendanceId}`}
                          className="attendance-hub__status-select"
                          value={row.status ?? 'absent'}
                          disabled={
                            row.attendanceId == null || updateStatusMutation.isPending
                          }
                          onChange={(e) => {
                            const status = e.target.value;
                            if (!row.attendanceId) return;
                            updateStatusMutation.mutate({
                              attendanceId: row.attendanceId,
                              status,
                            });
                          }}
                        >
                          {ATTENDANCE_STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="attendance-hub__modal-footer">
              <Link
                to={ROUTES.TEAM_ROLL_CALL.replace(':id', String(modalSession.teamId))}
                className="btn btn-secondary btn-sm"
              >
                Ouvrir la feuille d’appel complète
              </Link>
            </div>
          </>
        ) : null}
        {modalKey && !modalSession ? (
          sessionsQuery.isFetching ? (
            <Spinner label="Chargement…" />
          ) : (
            <Alert variant="error">
              Impossible d’afficher cette séance. Fermez et rouvrez depuis la liste.
            </Alert>
          )
        ) : null}
      </Modal>
    </AppPage>
  );
}
