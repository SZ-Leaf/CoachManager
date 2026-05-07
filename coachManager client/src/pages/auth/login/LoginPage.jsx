import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Alert from '../../../components/ui/feedback/Alert.jsx';
import LoginForm from '../../../components/ui/forms/auth/LoginForm.jsx';
import { ROUTES } from '../../../utils/routes.js';
import './login.css';

const LoginPage = () => {
  const location = useLocation();
  const [dismiss, setDismiss] = useState(false);

  return (
    <div className="auth-page">
      <header className="auth-page__header">
        <h1 className="auth-page__title">CoachManager</h1>
        <p className="auth-page__tagline">Connexion à votre espace</p>
      </header>
      <main className="auth-page__main">
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
      </main>
      <p className="auth-page__footer">
        Pas encore de compte ? <Link to={ROUTES.REGISTER}>Créer un compte</Link>
      </p>
    </div>
  );
};

export default LoginPage;
