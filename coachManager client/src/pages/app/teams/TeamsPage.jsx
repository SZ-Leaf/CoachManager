import AppPage from '../AppPage.jsx';

import './teams.css';

const TeamsPage = () => (
  <AppPage
    title="Équipes"
    description="Créez et gérez vos équipes, catégories et staffs."
  >
    <div className="teams-page">
      <p className="app-page__placeholder">
        Liste des équipes à connecter au backend.
      </p>
    </div>
  </AppPage>
);

export default TeamsPage;
