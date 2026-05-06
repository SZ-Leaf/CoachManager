import { Link } from 'react-router-dom';

import LoginForm from '../../../components/ui/forms/auth/LoginForm.jsx';
import './login.css';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <header className="auth-page__header">
        <h1 className="auth-page__title">CoachManager</h1>
        <p className="auth-page__tagline">Connexion à votre espace</p>
      </header>
      <main className="auth-page__main">
        <LoginForm />
      </main>
      <p className="auth-page__footer">
        Pas encore de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </div>
  );
};

export default LoginPage;
