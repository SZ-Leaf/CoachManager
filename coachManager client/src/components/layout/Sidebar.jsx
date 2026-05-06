import { NavLink } from 'react-router-dom';
import { LAYOUT_NAV_LINKS } from './navigation.js';

const Sidebar = ({ open, onNavigate }) => {
  return (
    <>
      <div
        className={`layout-sidebar-backdrop ${open ? 'is-open' : ''}`}
        onClick={onNavigate}
        role="presentation"
        aria-hidden={!open}
      />
      <aside
        id="app-sidebar"
        className={`layout-sidebar ${open ? 'is-open' : ''}`}
        aria-label="Navigation latérale"
      >
        <nav>
          <ul>
            {LAYOUT_NAV_LINKS.map(({ to, label }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
