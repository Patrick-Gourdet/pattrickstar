import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/about', label: 'About' },
  { to: '/tracks', label: 'Tracks' },
  { to: '/services', label: 'Services' },
  { to: '/book', label: 'Book' },
];

function EqBars() {
  return (
    <div className="eq-bars">
      {[20, 14, 22, 10, 18].map((h, i) => (
        <div key={i} className="eq-bar" style={{ '--h': `${h}px` }} />
      ))}
    </div>
  );
}

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const authDesktop = user ? (
    <>
      <span className="nav-user-pill">
        ◈ {user.name.split(' ')[0].toUpperCase()}
      </span>
      <Link to="/dashboard"><button type="button" className="btn btn-ghost btn-sm">PORTAL</button></Link>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
        EXIT
      </button>
    </>
  ) : (
    <>
      <Link to="/login"><button type="button" className="btn btn-ghost btn-sm">LOG IN</button></Link>
      <Link to="/register"><button type="button" className="btn btn-primary btn-sm">BOOK NOW</button></Link>
    </>
  );

  const authMobile = user ? (
    <div className="nav-mobile-auth">
      <span className="nav-user-pill nav-mobile-user">
        ◈ {user.name.split(' ')[0].toUpperCase()}
      </span>
      <Link to="/dashboard" onClick={closeMenu}>
        <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>PORTAL</button>
      </Link>
      <button
        type="button"
        className="btn btn-outline"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => {
          closeMenu();
          logout();
          navigate('/');
        }}
      >
        EXIT
      </button>
    </div>
  ) : (
    <div className="nav-mobile-auth">
      <Link to="/login" onClick={closeMenu}>
        <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>LOG IN</button>
      </Link>
      <Link to="/register" onClick={closeMenu}>
        <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>BOOK NOW</button>
      </Link>
    </div>
  );

  return (
    <>
      <nav className="nav">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <EqBars />
          Pattrick<span className="star">★</span>STAR
        </Link>

        <div className="nav-links nav-links--desktop">
          <div className="nav-anchors">
            {NAV_ITEMS.map(({ to, label }) => (
              <Link key={to} to={to} className="nav-anchor">{label}</Link>
            ))}
          </div>
          {authDesktop}
        </div>

        <button
          type="button"
          className={`nav-burger${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        id="nav-mobile-menu"
        className={`nav-mobile-panel${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="nav-mobile-backdrop"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeMenu}
        />
        <div className="nav-mobile-sheet">
          <div className="nav-mobile-links">
            {NAV_ITEMS.map(({ to, label }) => (
              <Link key={to} to={to} className="nav-mobile-link" onClick={closeMenu}>
                {label}
              </Link>
            ))}
          </div>
          <div className="nav-mobile-divider" />
          {authMobile}
        </div>
      </div>
    </>
  );
}
