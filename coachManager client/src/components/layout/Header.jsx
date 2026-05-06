import { Link, NavLink } from 'react-router-dom';
import { LAYOUT_NAV_LINKS } from './navigation.js';

const Header = ({ onMenuToggle, menuOpen }) => {
  const hasSidebar = typeof onMenuToggle === 'function';
  const headerClass =
    'layout-header' + (hasSidebar ? '' : ' layout-header--standalone');

  return (
    <header className={headerClass}>
      <div className="layout-header__brand">
        {hasSidebar ? (
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
        ) : null}
        <Link to="/" className="layout-header__logo">
          CoachManager
        </Link>
      </div>

      <nav className="layout-header__nav" aria-label="Navigation principale">
        <ul>
          {LAYOUT_NAV_LINKS.map(({ to, label }) => (
            <li key={label}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="layout-header__actions">
        {hasSidebar ? (
          <Link to="/login" className="layout-header__account">
            Mon compte
          </Link>
        ) : (
          <>
            <Link to="/login" className="layout-header__account layout-header__account--ghost">
              Connexion
            </Link>
            <Link to="/register" className="layout-header__register">
              Essai gratuit
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
