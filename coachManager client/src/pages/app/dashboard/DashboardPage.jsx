import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import Alert from '../../../components/ui/feedback/Alert.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import * as dashboardApi from '../../../services/dashboardService.js';
import AppPage from '../AppPage.jsx';
import './DashboardPage.css';

const STAT_META = [
  {
    key: 'playersCount',
    label: 'Joueurs',
    format: (v) => (v == null ? '—' : String(v)),
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    color: '#0d9488',
  },
  {
    key: 'teamsCount',
    label: 'Équipes',
    format: (v) => (v == null ? '—' : String(v)),
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    color: '#10b981',
  },
  {
    key: 'attendancePresentPercent',
    label: 'Présences',
    format: (v) => (v == null || Number.isNaN(Number(v)) ? '—' : `${Number(v)} %`),
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    color: '#f59e0b',
  },
  {
    key: 'messagesCount',
    label: 'Messages',
    format: (v) => (v == null ? '—' : String(v)),
    icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
    color: '#3b82f6',
  },
];

export default function DashboardPage() {
  const summaryQuery = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardApi.fetchDashboardSummary,
  });

  const stats = useMemo(() => {
    const d = summaryQuery.data;
    return STAT_META.map((m) => ({
      label: m.label,
      value: m.format(d?.[m.key]),
      icon: m.icon,
      color: m.color,
    }));
  }, [summaryQuery.data]);

  return (
    <AppPage
      title="Tableau de bord"
      description="Vue d’ensemble de votre club : accès rapide aux indicateurs et aux actions courantes."
    >
      <div className="dashboard-page">
        {summaryQuery.isLoading ? (
          <Spinner label="Chargement des indicateurs…" />
        ) : null}
        {summaryQuery.error ? (
          <Alert variant="error">{summaryQuery.error.message}</Alert>
        ) : null}

        {!summaryQuery.isLoading && !summaryQuery.error ? (
          <>
            <p className="dashboard-page__stats-hint">
              Les chiffres reflètent vos équipes, joueurs, messages et appels enregistrés (filtrés comme dans le reste de l’application).
            </p>
            <div className="dashboard-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <div
                    className="stat-card__icon"
                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={stat.icon} />
                    </svg>
                  </div>
                  <div className="stat-card__content">
                    <span className="stat-card__label">{stat.label}</span>
                    <span className="stat-card__value">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <div className="dashboard-sections">
          <section className="dashboard-section">
            <h3>Activités récentes</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot" style={{ backgroundColor: '#10b981' }} />
                <div className="activity-content">
                  <p>
                    <strong>Nouveau joueur</strong> ajouté : Thomas Martin
                  </p>
                  <span>Il y a 2 heures</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ backgroundColor: '#3b82f6' }} />
                <div className="activity-content">
                  <p>
                    <strong>Message envoyé</strong> à l&apos;équipe U17
                  </p>
                  <span>Hier à 18:30</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ backgroundColor: '#f59e0b' }} />
                <div className="activity-content">
                  <p>
                    <strong>Présences validées</strong> pour l&apos;entraînement du 05/05
                  </p>
                  <span>Il y a 2 jours</span>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h3>Prochains événements</h3>
            <div className="event-list">
              <div className="event-item">
                <div className="event-date">
                  <span className="event-day">08</span>
                  <span className="event-month">Mai</span>
                </div>
                <div className="event-content">
                  <p>Entraînement U17</p>
                  <span>18:00 - Stade Municipal</span>
                </div>
              </div>
              <div className="event-item">
                <div className="event-date">
                  <span className="event-day">10</span>
                  <span className="event-month">Mai</span>
                </div>
                <div className="event-content">
                  <p>Match Senior vs FC Ville</p>
                  <span>15:00 - Extérieur</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppPage>
  );
}
