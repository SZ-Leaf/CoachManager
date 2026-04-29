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
            {LAYOUT_NAV_LINKS.map(({ href, label }) => (
              <li key={label}>
                <a href={href} onClick={onNavigate}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
