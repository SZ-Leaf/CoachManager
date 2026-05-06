import AppPage from '../AppPage.jsx';

import './players.css';

const PlayersPage = () => (
  <AppPage
    title="Joueurs"
    description="Fiche joueur, statistiques et historique."
  >
    <div className="players-page">
      <p className="app-page__placeholder">
        Module joueurs à relier à votre API.
      </p>
    </div>
  </AppPage>
);

export default PlayersPage;
