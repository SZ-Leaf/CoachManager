import { LAYOUT_NAV_LINKS } from './navigation.js';

const Header = ({ onMenuToggle, menuOpen }) => {
  return (
    <header className="layout-header">
      <div className="layout-header__brand">
        <button
          type="button"
          className="layout-header__menu-btn"
          onClick={onMenuToggle}
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
          aria-label="Ouvrir ou fermer le menu"
        >
          <span className="layout-header__menu-icon" aria-hidden />
        </button>
        <a href="/" className="layout-header__logo">
          CoachManager
        </a>
      </div>

      <nav className="layout-header__nav" aria-label="Navigation principale">
        <ul>
          {LAYOUT_NAV_LINKS.map(({ href, label }) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="layout-header__actions">
        <a href="#" className="layout-header__account">
          Mon compte
        </a>
      </div>
    </header>
  );
};

export default Header;
