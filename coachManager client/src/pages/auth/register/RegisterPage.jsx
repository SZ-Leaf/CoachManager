import { Link } from 'react-router-dom';

import RegisterForm from '../../../components/ui/forms/auth/RegisterForm.jsx';
import { ROUTES } from '../../../utils/routes.js';
import '../AuthPages.css';

const RegisterPage = () => {
  return (
    <div className="auth-shell auth-shell--register">
      <div className="auth-shell__bg" aria-hidden />
      <div className="auth-shell__content">
        <Link className="auth-shell__back" to={ROUTES.HOME}>
          ← Accueil
        </Link>

        <div className="auth-hero">
          <div className="auth-brand__mark" aria-hidden />
          <h1 className="auth-hero__title">CoachManager</h1>
          <p className="auth-hero__tagline">
            Créez votre compte coach et centralisez la gestion de vos équipes.
          </p>
          <ul className="auth-hero__bullets">
            <li>Inscription rapide, accès sécurisé par session</li>
            <li>Compatible bureau et mobile pour le terrain</li>
          </ul>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">Créer un compte</h2>
              <p className="auth-card__subtitle">
                Quelques informations suffisent pour démarrer.
              </p>
            </header>
            <div className="auth-card__main">
              <RegisterForm />
            </div>
          </div>
          <p className="auth-panel__switch">
            Déjà inscrit ? <Link to={ROUTES.LOGIN}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
