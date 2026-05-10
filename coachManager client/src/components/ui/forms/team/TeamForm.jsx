import Alert from '../../feedback/Alert.jsx';
import {
  seasonApiValueToStartYear,
  startYearToSeasonApiValue,
} from '../../../../utils/teamSeason.js';

export default function TeamForm({
  form,
  setForm,
  seasonYearChoices,
  clubs,
  formError,
  isPending,
  onSubmit,
}) {
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
        <label>Nom</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Catégorie</label>
        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </div>
      <div>
        <label>Saison sportive</label>
        <select
          value={seasonApiValueToStartYear(form.season)}
          onChange={(e) =>
            setForm({
              ...form,
              season: e.target.value ? startYearToSeasonApiValue(e.target.value) : '',
            })
          }
        >
          <option value="">—</option>
          {seasonYearChoices.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Club</label>
        <select value={form.clubId} onChange={(e) => setForm({ ...form, clubId: e.target.value })}>
          <option value="">—</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  );
}
