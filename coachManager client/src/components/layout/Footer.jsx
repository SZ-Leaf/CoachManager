import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="layout-footer">
      <p className="layout-footer__copy">
        © {year} CoachManager
      </p>
      <nav className="layout-footer__nav" aria-label="Liens pied de page">
        <a href="#">Mentions légales</a>
        <a href="#">Confidentialité</a>
        <a href="#">Contact</a>
      </nav>
    </footer>
  );
};

export default Footer;
