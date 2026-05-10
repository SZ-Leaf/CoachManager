import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import * as attendanceApi from '../../../services/attendanceService.js';
import * as playerApi from '../../../services/playerService.js';
import * as teamApi from '../../../services/teamService.js';
import AppPage from '../AppPage.jsx';
import { ROUTES } from '../../../utils/routes.js';
import { ATTENDANCE_STATUS_OPTIONS } from '../../../utils/attendanceStatuses.js';
import { formatPlayerPosition } from '../../../utils/playerPosition.js';
import './TeamRollCallPage.css';

function defaultLocalSession() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function localInputToIso(localString) {
  if (!localString) return '';
  const d = new Date(localString);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString();
}

function normalizeRollRow(row) {
  if (!row || typeof row !== 'object') return null;
  const playerId = row.playerId ?? row.player_id;
  if (playerId == null || Number.isNaN(Number(playerId))) return null;
  return {
    playerId: Number(playerId),
    firstname: row.firstname ?? row.first_name ?? '',
    lastname: row.lastname ?? row.last_name ?? '',
    position: row.position ?? null,
    status: row.status ?? undefined,
    attendanceId: row.attendanceId ?? row.attendance_id ?? undefined,
  };
}

export default function TeamRollCallPage() {
  const { id: teamId } = useParams();
  const qc = useQueryClient();
  const [sessionLocal, setSessionLocal] = useState(defaultLocalSession);
  const [statusByPlayer, setStatusByPlayer] = useState({});
  const [saveMsg, setSaveMsg] = useState(null);

  const sessionIso = useMemo(() => {
    const iso = localInputToIso(sessionLocal);
    if (iso) return iso;
    return new Date().toISOString();
  }, [sessionLocal]);

  const teamQuery = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamApi.fetchTeam(teamId),
    enabled: Boolean(teamId),
  });

  const playersListQuery = useQuery({
    queryKey: ['players'],
    queryFn: playerApi.fetchPlayers,
    enabled: Boolean(teamId && teamQuery.isSuccess),
  });

  const rollQuery = useQuery({
    queryKey: ['teamRollCall', teamId, sessionIso],
    queryFn: () => attendanceApi.fetchTeamRollCall(teamId, sessionIso),
    enabled: Boolean(teamId && teamQuery.isSuccess),
    retry: (failureCount, error) => {
      const status = typeof error?.status === 'number' ? error.status : null;
      if (status !== null && status >= 400 && status < 500) return false;
      return failureCount < 1;
    },
  });

  const rosterFromListApi = useMemo(() => {
    const items = playersListQuery.data?.items ?? [];
    return items
      .filter((p) => String(p.teamId) === String(teamId))
      .map((p) => ({
        playerId: p.id,
        firstname: p.firstname ?? '',
        lastname: p.lastname ?? '',
        position: p.position ?? null,
        status: undefined,
        attendanceId: undefined,
      }));
  }, [playersListQuery.data, teamId]);

  const players = useMemo(() => {
    const raw = rollQuery.data?.players;
    const fromApi = Array.isArray(raw)
      ? raw.map(normalizeRollRow).filter(Boolean)
      : [];
    if (fromApi.length > 0) return fromApi;
    if (!rosterFromListApi.length) return [];
    if (
      rollQuery.isSuccess &&
      Array.isArray(raw) &&
      raw.length === 0
    ) {
      return rosterFromListApi;
    }
    if (rollQuery.isError) {
      return rosterFromListApi;
    }
    return [];
  }, [rollQuery.data, rollQuery.isSuccess, rollQuery.isError, rosterFromListApi]);

  useEffect(() => {
    if (!players.length) return;
    const next = {};
    for (const row of players) {
      next[row.playerId] = row.status ?? 'absent';
    }
    setStatusByPlayer(next);
  }, [rollQuery.data, players]);

  const saveMutation = useMutation({
    mutationFn: () =>
      attendanceApi.saveTeamRollCall(teamId, {
        sessionAt: sessionIso,
        entries: players.map((p) => ({
          playerId: p.playerId,
          status: statusByPlayer[p.playerId] ?? 'absent',
        })),
      }),
    onSuccess: () => {
      setSaveMsg({ variant: 'success', text: 'Appel enregistré.' });
      qc.invalidateQueries({ queryKey: ['teamRollCall', teamId, sessionIso] });
      qc.invalidateQueries({ queryKey: ['attendances'] });
    },
    onError: (e) => {
      setSaveMsg({ variant: 'error', text: e.message || 'Enregistrement impossible' });
    },
  });

  const team = teamQuery.data?.item || teamQuery.data;

  const counts = useMemo(() => {
    let present = 0;
    let absent = 0;
    let other = 0;
    for (const p of players) {
      const s = statusByPlayer[p.playerId] ?? 'absent';
      if (s === 'present') present += 1;
      else if (s === 'absent') absent += 1;
      else other += 1;
    }
    return { present, absent, other, total: players.length };
  }, [players, statusByPlayer]);

  const setAllPresent = () => {
    const next = { ...statusByPlayer };
    for (const p of players) {
      next[p.playerId] = 'present';
    }
    setStatusByPlayer(next);
  };

  const setAllAbsent = () => {
    const next = { ...statusByPlayer };
    for (const p of players) {
      next[p.playerId] = 'absent';
    }
    setStatusByPlayer(next);
  };

  if (teamQuery.isLoading) {
    return (
      <AppPage title="Chargement…">
        <Spinner />
      </AppPage>
    );
  }

  if (teamQuery.error || !team) {
    return (
      <AppPage title="Équipe introuvable">
        <Alert variant="error">{teamQuery.error?.message || 'Équipe introuvable'}</Alert>
        <Link to={ROUTES.TEAMS} className="btn btn-secondary">
          Retour aux équipes
        </Link>
      </AppPage>
    );
  }

  return (
    <AppPage
      title={`Appel — ${team.name}`}
      description="Choisissez la date et l’heure de la séance, puis indiquez le statut de chaque joueur."
      action={
        <div className="app-page__actions-row">
          <Link to={ROUTES.TEAM_DETAILS.replace(':id', teamId)} className="btn btn-secondary">
            Fiche équipe
          </Link>
          <Link to={ROUTES.ATTENDANCE} className="btn btn-ghost btn-sm">
            Toutes les équipes
          </Link>
        </div>
      }
    >
      <div className="roll-call">
        {saveMsg ? (
          <Alert
            variant={saveMsg.variant}
            onDismiss={() => setSaveMsg(null)}
          >
            {saveMsg.text}
          </Alert>
        ) : null}

        <div className="roll-call__session">
          <div className="roll-call__session-field">
            <label htmlFor="roll-session-at">Séance (date et heure)</label>
            <input
              id="roll-session-at"
              type="datetime-local"
              value={sessionLocal}
              onChange={(e) => setSessionLocal(e.target.value)}
            />
          </div>
          <p className="roll-call__hint">
            Les présences sont enregistrées pour ce créneau exact. Modifiez l’heure pour une autre séance.
          </p>
        </div>

        {playersListQuery.isLoading || rollQuery.isLoading ? (
          <Spinner label="Chargement de la feuille d’appel…" />
        ) : null}

        {!playersListQuery.isLoading &&
        !rollQuery.isLoading &&
        !rollQuery.isFetching &&
        players.length === 0 ? (
          <EmptyState
            title="Aucun joueur dans cette équipe"
            description="Ajoutez des joueurs rattachés à cette équipe pour faire l’appel."
          />
        ) : null}

        {players.length > 0 ? (
          <>
            <div className="roll-call__summary" role="status">
              <span>
                <strong>{counts.present}</strong> présent{counts.present !== 1 ? 's' : ''}
              </span>
              <span className="roll-call__summary-sep" aria-hidden>
                ·
              </span>
              <span>
                <strong>{counts.absent}</strong> absent{counts.absent !== 1 ? 's' : ''}
              </span>
              {counts.other > 0 ? (
                <>
                  <span className="roll-call__summary-sep" aria-hidden>
                    ·
                  </span>
                  <span>
                    <strong>{counts.other}</strong> autre{counts.other !== 1 ? 's' : ''}
                  </span>
                </>
              ) : null}
              <span className="roll-call__summary-sep" aria-hidden>
                ·
              </span>
              <span>{counts.total} joueur{counts.total !== 1 ? 's' : ''}</span>
            </div>

            <div className="roll-call__bulk">
              <button type="button" className="btn btn-secondary btn-sm" onClick={setAllPresent}>
                Tous présents
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={setAllAbsent}>
                Tous absents
              </button>
            </div>

            <ul className="roll-call__list">
              {players.map((p) => {
                const status = statusByPlayer[p.playerId] ?? 'absent';
                const isPresent = status === 'present';
                return (
                  <li key={p.playerId} className="roll-call__row">
                    <label className="roll-call__check">
                      <input
                        type="checkbox"
                        checked={isPresent}
                        onChange={(e) =>
                          setStatusByPlayer((prev) => ({
                            ...prev,
                            [p.playerId]: e.target.checked ? 'present' : 'absent',
                          }))
                        }
                      />
                      <span className="roll-call__check-ui" aria-hidden />
                      <span className="roll-call__check-label">Présent</span>
                    </label>
                    <div className="roll-call__player">
                      <span className="roll-call__name">
                        {p.firstname} {p.lastname}
                      </span>
                      {p.position ? (
                        <span className="roll-call__meta">{formatPlayerPosition(p.position)}</span>
                      ) : null}
                    </div>
                    <div className="roll-call__status">
                      {!isPresent ? (
                        <>
                          <span className="roll-call__status-label">Sinon :</span>
                          <label className="sr-only" htmlFor={`status-${p.playerId}`}>
                            Détail du statut pour {p.firstname} {p.lastname}
                          </label>
                          <select
                            id={`status-${p.playerId}`}
                            value={status === 'present' ? 'absent' : status}
                            onChange={(e) =>
                              setStatusByPlayer((prev) => ({
                                ...prev,
                                [p.playerId]: e.target.value,
                              }))
                            }
                          >
                            {ATTENDANCE_STATUS_OPTIONS.filter((o) => o.value !== 'present').map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <span className="roll-call__status-present">Marqué présent</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="roll-call__footer">
              <button
                type="button"
                className="btn btn-primary"
                disabled={saveMutation.isPending || rollQuery.isLoading}
                onClick={() => {
                  setSaveMsg(null);
                  saveMutation.mutate();
                }}
              >
                {saveMutation.isPending ? 'Enregistrement…' : 'Enregistrer l’appel'}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </AppPage>
  );
}
