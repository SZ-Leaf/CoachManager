import { useState } from 'react';

const RECIPIENT_TYPES = ['player', 'emergency'];

const MessageForm = () => {
  const [formData, setFormData] = useState({
    player_id: '',
    recipient_type: '',
    recipient_email: '',
    subject: '',
    body: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <h2>Nouveau Message</h2>

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
        <label htmlFor="recipient_type">Type de destinataire</label>
        <select
          id="recipient_type"
          name="recipient_type"
          value={formData.recipient_type}
          onChange={handleChange}
          required
        >
          <option value="">-- Sélectionner --</option>
          {RECIPIENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="recipient_email">Email du destinataire</label>
        <input
          id="recipient_email"
          type="email"
          name="recipient_email"
          value={formData.recipient_email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="subject">Sujet</label>
        <input
          id="subject"
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="body">Message</label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          rows={6}
          required
        />
      </div>

      <button type="submit">Envoyer</button>
    </form>
  );
};

export default MessageForm;
