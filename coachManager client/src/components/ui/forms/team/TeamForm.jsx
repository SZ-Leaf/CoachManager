import { useState } from 'react';

const TeamForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    season: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="team-form" onSubmit={handleSubmit}>
      <h2>Gestion de l'Équipe</h2>

      <div>
        <label htmlFor="name">Nom de l'équipe</label>
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
        <label htmlFor="category">Catégorie</label>
        <input
          id="category"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Ex: U17, Senior, Féminine..."
        />
      </div>

      <div>
        <label htmlFor="season">Saison</label>
        <input
          id="season"
          type="date"
          name="season"
          value={formData.season}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default TeamForm;
