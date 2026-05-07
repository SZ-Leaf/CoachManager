import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../../context/AuthContext.jsx';
import { ROUTES } from '../../../../utils/routes.js';
import Alert from '../../feedback/Alert.jsx';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPending(true);
    try {
      await login(formData);
      const dest = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || 'Connexion impossible');
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {error ? (
        <Alert variant="error" title="Erreur">
          {error}
        </Alert>
      ) : null}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
};

export default LoginForm;
