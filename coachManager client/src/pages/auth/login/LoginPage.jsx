import { Link, useNavigate } from 'react-router-dom';

import LoginForm from '../../../components/ui/forms/auth/LoginForm.jsx';
import Modal from '../../../components/ui/modals/Modal.jsx';
import './login.css';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <Modal
        isOpen
        title="Connexion"
        onClose={() => navigate('/')}
      >
        <LoginForm />
        <p className="auth-modal__footer">
          Pas encore de compte ?{' '}
          <Link to="/register">Créer un compte</Link>
        </p>
      </Modal>
    </div>
  );
};

export default LoginPage;
