import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import '../../components/layout/layout.css';
import './home.css';

const HomePage = () => {
  return (
    <>
      <div className="home-minimal__header">
        <Header />
      </div>
      <div className="home-minimal">
        <main className="home-hero">
          <h1 className="hero-title">Gérez votre équipe, simplement.</h1>
          <p className="hero-subtitle">
            L'outil de gestion d'entraînement minimaliste pour les
            coachs exigeants.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="cta-primary">
              Commencer maintenant
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;
