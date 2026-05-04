const Spinner = ({ label = 'Chargement en cours…', size = 'md' }) => {
  const sizeClass = size === 'sm' || size === 'lg' ? `feedback-spinner--${size}` : '';

  return (
    <div className={`feedback-spinner ${sizeClass}`} role="status" aria-label={label}>
      <span className="feedback-spinner__ring" aria-hidden />
      <span className="feedback-spinner__label">{label}</span>
    </div>
  );
};

export default Spinner;
