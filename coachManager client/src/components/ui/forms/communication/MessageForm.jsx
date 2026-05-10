import Alert from '../../feedback/Alert.jsx';

export default function MessageForm({ form, setForm, players, formError, isPending, onSubmit }) {
  return (
    <form
      className="app-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {formError ? <Alert variant="error">{formError}</Alert> : null}
      <div>
        <label>Joueur *</label>
        <select
          value={form.playerId}
          onChange={(e) => setForm({ ...form, playerId: e.target.value })}
          required
        >
          <option value="">—</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstname} {p.lastname}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Destinataire</label>
        <select
          value={form.recipientType}
          onChange={(e) => setForm({ ...form, recipientType: e.target.value })}
        >
          <option value="player">Joueur</option>
          <option value="emergency">Urgence</option>
        </select>
      </div>
      <div>
        <label>Email destinataire</label>
        <input
          type="email"
          value={form.recipientEmail}
          onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
        />
      </div>
      <div>
        <label>Sujet</label>
        <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      </div>
      <div>
        <label>Corps</label>
        <textarea rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
      </div>
      <div>
        <label>Statut</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="">—</option>
          <option value="sent">Envoyé</option>
          <option value="failed">Échec</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  );
}
