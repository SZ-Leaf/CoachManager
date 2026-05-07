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
            {LAYOUT_NAV_LINKS.map(({ to, label, icon }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                >
                  {icon && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={icon} />
                    </svg>
                  )}
                  <span>{label}</span>
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
