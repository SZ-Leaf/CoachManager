import { useEffect, useState } from 'react';

const POSITIONS = [
  { value: 'goalkeeper', label: 'Gardien' },
  { value: 'defender', label: 'Défenseur' },
  { value: 'midfielder', label: 'Milieu' },
  { value: 'forward', label: 'Attaquant' },
  { value: 'other', label: 'Autre' },
];
const STATUSES = [
  { value: 'active', label: 'Actif' },
  { value: 'injured', label: 'Blessé' },
  { value: 'suspended', label: 'Suspendu' },
  { value: 'inactive', label: 'Inactif' },
];

function fieldError(serverErrors, field) {
  const row = serverErrors?.find((e) => e.field === field);
  return row?.message;
}

export default function PlayerForm({
  teams = [],
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  serverErrors = [],
}) {
  const [formData, setFormData] = useState(() => ({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    avatar: '',
    position: '',
    status: '',
    rating: '',
    emergencyName: '',
    emergencyEmail: '',
    emergencyPhoneNumber: '',
    teamId: '',
    ...initialValues,
  }));

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email || null,
      phoneNumber: formData.phoneNumber || null,
      birthday: formData.birthday || null,
      avatar: formData.avatar || null,
      position: formData.position || null,
      status: formData.status || null,
      rating: formData.rating === '' ? null : Number(formData.rating),
      emergencyName: formData.emergencyName || null,
      emergencyEmail: formData.emergencyEmail || null,
      emergencyPhoneNumber: formData.emergencyPhoneNumber || null,
      teamId: formData.teamId ? Number(formData.teamId) : null,
    };
    onSubmit(payload);
  };

  return (
    <form className="player-form crud-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Informations personnelles</legend>
        <label>
          Prénom *
          <input
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nom *
          <input
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Téléphone
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          Date de naissance
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </label>
        <label>
          Avatar (URL)
          <input name="avatar" value={formData.avatar} onChange={handleChange} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Sport</legend>
        <label>
          Équipe *
          <select
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            required
          >
            <option value="">—</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Poste
          <select name="position" value={formData.position} onChange={handleChange}>
            <option value="">—</option>
            {POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Statut
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="">—</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Note
          <input
            type="number"
            name="rating"
            min={0}
            max={100}
            value={formData.rating}
            onChange={handleChange}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Urgence</legend>
        <label>
          Nom contact
          <input
            name="emergencyName"
            value={formData.emergencyName}
            onChange={handleChange}
          />
        </label>
        <label>
          Email contact
          <input
            type="email"
            name="emergencyEmail"
            value={formData.emergencyEmail}
            onChange={handleChange}
          />
        </label>
        <label>
          Téléphone contact
          <input
            type="tel"
            name="emergencyPhoneNumber"
            value={formData.emergencyPhoneNumber}
            onChange={handleChange}
          />
        </label>
      </fieldset>

      {serverErrors?.length ? (
        <p className="form-server-error" role="alert">
          {fieldError(serverErrors, 'firstname') ||
            serverErrors.map((x) => x.message).join(' ')}
        </p>
      ) : null}

      <div className="crud-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
