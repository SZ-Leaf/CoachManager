import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Alert from '../../../components/ui/feedback/Alert.jsx';
import LoginForm from '../../../components/ui/forms/auth/LoginForm.jsx';
import { ROUTES } from '../../../utils/routes.js';
import '../AuthPages.css';

const LoginPage = () => {
  const location = useLocation();
  const [dismiss, setDismiss] = useState(false);

  return (
    <div className="auth-shell">
      <div className="auth-shell__bg" aria-hidden />
      <div className="auth-shell__content">
        <Link className="auth-shell__back" to={ROUTES.HOME}>
          ← Accueil
        </Link>

        <div className="auth-hero">
          <div className="auth-brand__mark" aria-hidden />
          <h1 className="auth-hero__title">CoachManager</h1>
          <p className="auth-hero__tagline">
            Votre espace pour gérer équipes, joueurs et présences en toute simplicité.
          </p>
          <ul className="auth-hero__bullets">
            <li>Tableau de bord clair pour suivre l’activité du club</li>
            <li>Feuilles d’appel et inventaire au même endroit</li>
          </ul>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">Connexion</h2>
              <p className="auth-card__subtitle">
                Entrez vos identifiants pour accéder à votre compte.
              </p>
            </header>
            <div className="auth-card__main">
              {location.state?.registered && !dismiss ? (
                <Alert
                  variant="success"
                  onDismiss={() => setDismiss(true)}
                  title="Compte créé"
                >
                  Vous pouvez maintenant vous connecter.
                </Alert>
              ) : null}
              <LoginForm />
            </div>
          </div>
          <p className="auth-panel__switch">
            Pas encore de compte ? <Link to={ROUTES.REGISTER}>Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
