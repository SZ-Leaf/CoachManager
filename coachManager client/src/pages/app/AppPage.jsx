const AppPage = ({ title, description, children }) => (
  <div className="app-page">
    <header className="app-page__header">
      <h1 className="app-page__title">{title}</h1>
      {description ? (
        <p className="app-page__description">{description}</p>
      ) : null}
    </header>
    {children ? <div className="app-page__content">{children}</div> : null}
  </div>
);

export default AppPage;
