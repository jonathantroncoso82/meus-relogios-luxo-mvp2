import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Watch,
  LayoutDashboard,
  Tag,
  FolderOpen,
  Wrench,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/watches', label: 'Watches', icon: Watch },
  { to: '/brands', label: 'Brands', icon: Tag },
  { to: '/collections', label: 'Collections', icon: FolderOpen },
  { to: '/service-records', label: 'Service Records', icon: Wrench },
  { to: '/valuations', label: 'Valuations', icon: TrendingUp },
];

const styles: Record<string, React.CSSProperties> = {
  shell: { display: 'flex', minHeight: '100vh', background: '#0f0f0f' },
  sidebar: {
    width: 240,
    background: '#1a1a1a',
    borderRight: '1px solid #2a2a2a',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 100,
    transition: 'transform 0.2s',
  },
  sidebarHidden: { transform: 'translateX(-240px)' },
  logo: {
    padding: '24px 20px',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoText: { fontSize: 18, fontWeight: 700, color: '#c9a84c', letterSpacing: 1 },
  nav: { flex: 1, padding: '16px 0', overflowY: 'auto' },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 20px',
    color: '#888',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.15s',
    borderLeft: '3px solid transparent',
  },
  navLinkActive: {
    color: '#c9a84c',
    background: 'rgba(201,168,76,0.08)',
    borderLeft: '3px solid #c9a84c',
  },
  footer: { padding: '16px 20px', borderTop: '1px solid #2a2a2a' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: 14,
    padding: '8px 0',
    width: '100%',
  },
  main: { flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  topbar: {
    height: 56,
    background: '#1a1a1a',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: 12,
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    display: 'none',
  },
  content: { flex: 1, padding: 24 },
};

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, ...(sidebarOpen ? {} : styles.sidebarHidden) }}>
        <div style={styles.logo}>
          <Watch size={22} color="#c9a84c" />
          <span style={styles.logoText}>LuxWatch</span>
        </div>

        <nav style={styles.nav}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.footer}>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>
            {user?.name}
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={styles.main}>
        <header style={styles.topbar}>
          <button
            style={styles.menuBtn}
            onClick={() => setSidebarOpen((o) => !o)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span style={{ color: '#c9a84c', fontWeight: 600, fontSize: 15 }}>
            Luxury Watch Collection
          </span>
        </header>

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
