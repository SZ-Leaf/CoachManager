import Alert from '../../feedback/Alert.jsx';

export const CLUB_DISCIPLINE_OPTIONS = [
  'football',
  'basketball',
  'rugby',
  'tennis',
  'volleyball',
  'handball',
  'other',
];

export default function ClubForm({ form, setForm, formError, isPending, onSubmit }) {
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
        <label>Nom *</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Discipline</label>
        <select
          value={form.discipline}
          onChange={(e) => setForm({ ...form, discipline: e.target.value })}
        >
          <option value="">—</option>
          {CLUB_DISCIPLINE_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Logo (URL)</label>
        <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
      </div>
      <div>
        <label>Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  );
}
