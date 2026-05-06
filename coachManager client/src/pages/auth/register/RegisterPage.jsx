import { Link, useNavigate } from 'react-router-dom';

import RegisterForm from '../../../components/ui/forms/auth/RegisterForm.jsx';
import Modal from '../../../components/ui/modals/Modal.jsx';
import './register.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <Modal
        isOpen
        title="Inscription"
        onClose={() => navigate('/')}
      >
        <RegisterForm />
        <p className="auth-modal__footer">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </Modal>
    </div>
  );
};

export default RegisterPage;
