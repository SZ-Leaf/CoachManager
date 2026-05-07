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
    <form className="app-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Informations personnelles</legend>
        <div>
          <label>Prénom *</label>
          <input
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nom *</label>
          <input
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Téléphone</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date de naissance</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Avatar (URL)</label>
          <input name="avatar" value={formData.avatar} onChange={handleChange} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Sport</legend>
        <div>
          <label>Équipe *</label>
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
        </div>
        <div>
          <label>Poste</label>
          <select name="position" value={formData.position} onChange={handleChange}>
            <option value="">—</option>
            {POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Statut</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="">—</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Note</label>
          <input
            type="number"
            name="rating"
            min={0}
            max={100}
            value={formData.rating}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Urgence</legend>
        <div>
          <label>Nom contact</label>
          <input
            name="emergencyName"
            value={formData.emergencyName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email contact</label>
          <input
            type="email"
            name="emergencyEmail"
            value={formData.emergencyEmail}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Téléphone contact</label>
          <input
            type="tel"
            name="emergencyPhoneNumber"
            value={formData.emergencyPhoneNumber}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      {serverErrors?.length ? (
        <p className="form-error" role="alert">
          {fieldError(serverErrors, 'firstname') ||
            serverErrors.map((x) => x.message).join(' ')}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  );
}
