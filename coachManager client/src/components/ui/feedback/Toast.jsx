import { useEffect } from 'react';

const VARIANTS = ['info', 'success', 'warning', 'error'];

const Toast = ({
  message,
  variant = 'info',
  onClose,
  duration = 5000,
}) => {
  const safeVariant = VARIANTS.includes(variant) ? variant : 'info';

  useEffect(() => {
    if (!onClose || duration <= 0) return undefined;
    const id = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(id);
  }, [onClose, duration]);

  if (!message) return null;

  return (
    <div
      className={`feedback-toast feedback-toast--${safeVariant}`}
      role="status"
      aria-live="polite"
    >
      <p className="feedback-toast__message">{message}</p>
      {onClose && (
        <button
          type="button"
          className="feedback-toast__close"
          onClick={onClose}
          aria-label="Fermer la notification"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Toast;
