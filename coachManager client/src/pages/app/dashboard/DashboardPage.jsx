import AppPage from '../AppPage.jsx';

import './dashboard.css';

const DashboardPage = () => (
  <AppPage
    title="Tableau de bord"
    description="Vue d’ensemble de votre club : accès rapide aux indicateurs et aux actions courantes."
  >
    <div className="dashboard-page">
      <p className="app-page__placeholder">
        Aucune donnée pour l’instant — branchez vos API ou ajoutez vos composants ici.
      </p>
    </div>
  </AppPage>
);

export default DashboardPage;
