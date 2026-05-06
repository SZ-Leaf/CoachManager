import { Link } from 'react-router-dom';

import './not-found.css';

const NotFoundPage = () => (
  <div className="not-found-page">
    <h1 className="not-found-page__title">Page introuvable</h1>
    <p className="not-found-page__text">
      La page demandée n'existe pas ou a été déplacée.
    </p>
    <Link to="/" className="not-found-page__link">
      Retour à l'accueil
    </Link>
  </div>
);

export default NotFoundPage;
