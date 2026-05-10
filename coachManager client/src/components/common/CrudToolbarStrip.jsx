import ResetFiltersIcon from './ResetFiltersIcon.jsx';

export default function CrudToolbarStrip({
  children,
  showReset = false,
  onReset,
  resetLabel = 'Réinitialiser les filtres',
}) {
  return (
    <div className="crud-toolbar-strip">
      {children}
      {showReset && onReset ? (
        <button
          type="button"
          className="btn btn-secondary crud-toolbar-strip__reset"
          onClick={onReset}
          aria-label={resetLabel}
          title={resetLabel}
        >
          <ResetFiltersIcon />
        </button>
      ) : null}
    </div>
  );
}
