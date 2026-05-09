import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../../context/AuthContext.jsx';
import { ROUTES } from '../../../../utils/routes.js';
import Alert from '../../feedback/Alert.jsx';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    avatar: '',
  });
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
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      };
      if (formData.avatar.trim()) {
        payload.avatar = formData.avatar.trim();
      }
      await register(payload);
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { registered: true },
      });
    } catch (err) {
      const msg =
        err.body?.errors?.map((x) => x.message).join(' ') || err.message;
      setError(msg || 'Inscription impossible');
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
        <label htmlFor="firstname">Prénom</label>
        <input
          id="firstname"
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          required
          minLength={3}
        />
      </div>

      <div>
        <label htmlFor="lastname">Nom</label>
        <input
          id="lastname"
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          required
          minLength={3}
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
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
          required
          minLength={8}
        />
        <small className="app-form__hint">
          Au moins 8 caractères, une majuscule et un chiffre.
        </small>
      </div>

      <div>
        <label htmlFor="avatar">Avatar (optionnel)</label>
        <input
          id="avatar"
          type="url"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Envoi…' : "S'inscrire"}
      </button>
    </form>
  );
};

export default RegisterForm;
