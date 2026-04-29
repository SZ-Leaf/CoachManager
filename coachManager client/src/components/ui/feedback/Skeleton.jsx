const Skeleton = ({ lines = 3, className = '' }) => {
  const count = Math.max(1, Math.min(lines, 12));

  return (
    <div
      className={`feedback-skeleton ${className}`.trim()}
      aria-busy="true"
      aria-label="Chargement du contenu"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="feedback-skeleton__line"
          style={{ width: i === count - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
};

export default Skeleton;
