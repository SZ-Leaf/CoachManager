import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../../context/AuthContext.jsx';
import { ROUTES } from '../../../../utils/routes.js';
import Alert from '../../feedback/Alert.jsx';

const ACCEPT_AVATAR = 'image/jpeg,image/png,image/gif,image/webp';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('firstname', formData.firstname.trim());
      fd.append('lastname', formData.lastname.trim());
      fd.append('email', formData.email.trim());
      fd.append('password', formData.password);
      if (avatarFile) {
        fd.append('avatar', avatarFile);
      }
      await register(fd);
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
    <form className="app-form auth-form" onSubmit={handleSubmit} encType="multipart/form-data">
      {error ? (
        <Alert variant="error" title="Erreur">
          {error}
        </Alert>
      ) : null}

      <div className="auth-form__row">
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
          Au moins 8 caractères, une majuscule, un caractère spécial et un chiffre.
        </small>
      </div>

      <div className="auth-avatar-field">
        <label htmlFor="avatar-file">Photo de profil (optionnel)</label>
        {avatarPreview ? (
          <div className="auth-avatar-preview">
            <img src={avatarPreview} alt="Aperçu de votre photo" className="auth-avatar-preview__img" />
            <div className="auth-avatar-preview__actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={clearAvatar}>
                Retirer la photo
              </button>
            </div>
          </div>
        ) : null}
        <input
          ref={avatarInputRef}
          id="avatar-file"
          type="file"
          name="avatar"
          accept={ACCEPT_AVATAR}
          onChange={handleAvatarChange}
          className="auth-avatar-file-input"
        />
        <small className="app-form__hint">JPEG, PNG, GIF ou WebP — 2 Mo maximum.</small>
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Envoi…' : "S'inscrire"}
      </button>
    </form>
  );
};

export default RegisterForm;
