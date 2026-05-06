import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import './layout.css';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div className="app-layout">
      <Header onMenuToggle={toggleSidebar} menuOpen={sidebarOpen} />
      <div className="app-layout__shell">
        <Sidebar open={sidebarOpen} onNavigate={closeSidebar} />
        <main className="app-layout__main" id="main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
