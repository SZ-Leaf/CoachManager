import { useState } from 'react';

const ATTENDANCE_STATUSES = ['present', 'absent', 'late'];

const AttendanceForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    player_id: '',
    status: '',
    comment: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="attendance-form" onSubmit={handleSubmit}>
      <h2>Feuille de Présence</h2>

      <div>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="player_id">Joueur</label>
        <input
          id="player_id"
          type="number"
          name="player_id"
          value={formData.player_id}
          onChange={handleChange}
          placeholder="ID du joueur"
          required
        />
      </div>

      <div>
        <label htmlFor="status">Statut</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="">-- Sélectionner --</option>
          {ATTENDANCE_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="comment">Commentaire</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default AttendanceForm;
