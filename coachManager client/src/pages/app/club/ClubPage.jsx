import AppPage from '../AppPage.jsx';

import './club.css';

const ClubPage = () => (
  <AppPage
    title="Club"
    description="Identité du club, coordonnées et paramètres généraux."
  >
    <div className="club-page">
      <p className="app-page__placeholder">
        Formulaire et détails du club à intégrer.
      </p>
    </div>
  </AppPage>
);

export default ClubPage;
