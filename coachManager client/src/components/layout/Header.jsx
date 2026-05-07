import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../utils/routes.js';
import { LAYOUT_NAV_LINKS } from './navigation.js';

const Header = ({ onMenuToggle, menuOpen }) => {
  const { user, logout } = useAuth();
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

  const handleLogout = async () => {
    await logout();
  };

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
            <>
              <span className="layout-header__account" style={{ cursor: 'default' }}>
                {user?.firstname}
              </span>
              <button
                type="button"
                className="layout-header__account layout-header__account--ghost"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </>
          ) : user ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="layout-header__account">
                Espace coach
              </Link>
              <button
                type="button"
                className="layout-header__account layout-header__account--ghost"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="layout-header__account layout-header__account--ghost"
              >
                Connexion
              </Link>
              <Link to={ROUTES.REGISTER} className="layout-header__register">
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
