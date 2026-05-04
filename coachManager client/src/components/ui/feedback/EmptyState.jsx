const EmptyState = ({ title = 'Aucun élément', description, action }) => {
  return (
    <div className="feedback-empty" role="status">
      <p className="feedback-empty__title">{title}</p>
      {description && <p className="feedback-empty__description">{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
