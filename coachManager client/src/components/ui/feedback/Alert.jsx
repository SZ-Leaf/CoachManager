const VARIANTS = ['info', 'success', 'warning', 'error'];

const Alert = ({ variant = 'info', title, children, onDismiss }) => {
  const safeVariant = VARIANTS.includes(variant) ? variant : 'info';

  return (
    <div className={`feedback-alert feedback-alert--${safeVariant}`} role="alert">
      <div className="feedback-alert__content">
        {title && <p className="feedback-alert__title">{title}</p>}
        {children && <div className="feedback-alert__body">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="feedback-alert__dismiss"
          onClick={onDismiss}
          aria-label="Fermer le message"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
