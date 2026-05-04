import { useState } from 'react';

const POSITIONS = ['goalkeeper', 'defender', 'midfielder', 'forward', 'other'];
const STATUSES = ['active', 'injured', 'suspended', 'inactive'];

const PlayerForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone_number: '',
    birthday: '',
    avatar: '',
    position: '',
    status: '',
    rating: '',
    emergency_name: '',
    emergency_email: '',
    emergency_phone_number: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="player-form" onSubmit={handleSubmit}>
      <h2>Ajouter / Modifier un Joueur</h2>

      <fieldset>
        <legend>Informations personnelles</legend>

        <div>
          <label htmlFor="firstname">Prénom</label>
          <input
            id="firstname"
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
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
          />
        </div>

        <div>
          <label htmlFor="phone_number">Téléphone</label>
          <input
            id="phone_number"
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="birthday">Date de naissance</label>
          <input
            id="birthday"
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="avatar">Avatar (URL)</label>
          <input
            id="avatar"
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Informations sportives</legend>

        <div>
          <label htmlFor="position">Poste</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          >
            <option value="">-- Sélectionner --</option>
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status">Statut</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">-- Sélectionner --</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rating">Note</label>
          <input
            id="rating"
            type="number"
            name="rating"
            min="0"
            max="100"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Contact d'urgence</legend>

        <div>
          <label htmlFor="emergency_name">Nom</label>
          <input
            id="emergency_name"
            type="text"
            name="emergency_name"
            value={formData.emergency_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="emergency_email">Email</label>
          <input
            id="emergency_email"
            type="email"
            name="emergency_email"
            value={formData.emergency_email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="emergency_phone_number">Téléphone</label>
          <input
            id="emergency_phone_number"
            type="tel"
            name="emergency_phone_number"
            value={formData.emergency_phone_number}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default PlayerForm;
