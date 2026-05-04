import { useState } from 'react';

const DISCIPLINES = ['football', 'basketball', 'rugby', 'tennis', 'volleyball', 'handball', 'other'];

const ClubForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    discipline: '',
    logo: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="club-form" onSubmit={handleSubmit}>
      <h2>Paramètres du Club</h2>

      <div>
        <label htmlFor="name">Nom du club</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="discipline">Discipline</label>
        <select
          id="discipline"
          name="discipline"
          value={formData.discipline}
          onChange={handleChange}
          required
        >
          <option value="">-- Sélectionner --</option>
          {DISCIPLINES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="logo">Logo (URL)</label>
        <input
          id="logo"
          type="text"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default ClubForm;
