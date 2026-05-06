import { Link } from 'react-router-dom';

import RegisterForm from '../../../components/ui/forms/auth/RegisterForm.jsx';
import './register.css';

const RegisterPage = () => {
  return (
    <div className="auth-page">
      <header className="auth-page__header">
        <h1 className="auth-page__title">CoachManager</h1>
        <p className="auth-page__tagline">Créer votre compte</p>
      </header>
      <main className="auth-page__main">
        <RegisterForm />
      </main>
      <p className="auth-page__footer">
        Déjà inscrit ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
