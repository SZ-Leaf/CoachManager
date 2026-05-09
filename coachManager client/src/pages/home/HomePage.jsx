import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import { ROUTES } from '../../utils/routes.js';
import './HomePage.css';

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
            <Link to={ROUTES.REGISTER} className="cta-primary">
              Commencer maintenant
            </Link>
          </div>
        </main>

        <section className="home-info">
          <div className="info-item">
            <h3>Gestion Simplifiée</h3>
            <p>Gérez vos joueurs, vos équipes et vos entraînements en quelques clics seulement.</p>
          </div>
          <div className="info-item">
            <h3>Suivi des Présences</h3>
            <p>Gardez un œil sur l'assiduité de vos joueurs avec notre système de pointage intuitif.</p>
          </div>
          <div className="info-item">
            <h3>Inventaire & Matériel</h3>
            <p>Ne perdez plus jamais votre matériel grâce à notre gestionnaire de stock intégré.</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
