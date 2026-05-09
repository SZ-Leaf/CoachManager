import './AppPage.css';

const AppPage = ({ title, description, action, children }) => (
  <div className="app-page">
    <header className="app-page__header">
      <div className="app-page__header-row">
        <h1 className="app-page__title">{title}</h1>
        {action && <div className="app-page__actions">{action}</div>}
      </div>
      {description ? (
        <p className="app-page__description">{description}</p>
      ) : null}
    </header>
    {children ? <div className="app-page__content">{children}</div> : null}
  </div>
);

export default AppPage;
