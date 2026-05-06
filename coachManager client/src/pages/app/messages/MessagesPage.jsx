import AppPage from '../AppPage.jsx';

import './messages.css';

const MessagesPage = () => (
  <AppPage
    title="Messages"
    description="Échanges avec les joueurs, parents et le staff."
  >
    <div className="messages-page">
      <p className="app-page__placeholder">
        Messagerie ou notifications à prévoir.
      </p>
    </div>
  </AppPage>
);

export default MessagesPage;
