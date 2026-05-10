import { useCallback, useState } from 'react';

export function useCrudModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const openModal = useCallback(() => {
    setFormError('');
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setFormError('');
  }, []);

  return {
    isOpen,
    setIsOpen,
    formError,
    setFormError,
    openModal,
    closeModal,
  };
}
