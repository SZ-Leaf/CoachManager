import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LAYOUT_NAV_LINKS } from './navigation.js';

const Header = ({ onMenuToggle, menuOpen }) => {
  const hasSidebar = typeof onMenuToggle === 'function';
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);

  const menuExpanded = hasSidebar ? menuOpen : publicMenuOpen;

  const toggleMenu = () => {
    if (hasSidebar) onMenuToggle();
    else setPublicMenuOpen((v) => !v);
  };

  const closePublicMenu = () => setPublicMenuOpen(false);

  const headerClass =
    'layout-header' + (hasSidebar ? '' : ' layout-header--standalone');

  return (
    <>
      <header className={headerClass}>
        <div className="layout-header__brand">
          <button
            type="button"
            className="layout-header__menu-btn"
            onClick={toggleMenu}
            aria-expanded={menuExpanded}
            aria-controls={hasSidebar ? 'app-sidebar' : 'home-nav-drawer'}
            aria-label="Ouvrir ou fermer le menu"
          >
            <span className="layout-header__menu-icon" aria-hidden />
          </button>
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
              <Link
                to="/login"
                className="layout-header__account layout-header__account--ghost"
              >
                Connexion
              </Link>
              <Link to="/register" className="layout-header__register">
                Essai gratuit
              </Link>
            </>
          )}
        </div>
      </header>

      {!hasSidebar ? (
        <>
          <div
            className={`layout-sidebar-backdrop ${publicMenuOpen ? 'is-open' : ''}`}
            onClick={closePublicMenu}
            role="presentation"
            aria-hidden={!publicMenuOpen}
          />
          <aside
            id="home-nav-drawer"
            className={`layout-sidebar layout-sidebar--public ${publicMenuOpen ? 'is-open' : ''}`}
            aria-label="Navigation"
          >
            <nav>
              <ul>
                {LAYOUT_NAV_LINKS.map(({ to, label }) => (
                  <li key={label}>
                    <NavLink
                      to={to}
                      onClick={closePublicMenu}
                      className={({ isActive }) =>
                        isActive ? 'is-active' : undefined
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </>
      ) : null}
    </>
  );
};

export default Header;
