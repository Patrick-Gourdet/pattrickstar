import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <EqBars />
        PATRICK<span className="star">★</span>STAR
      </Link>
      <div className="nav-links">
        <div className="nav-anchors">
          <Link to="/about" className="nav-anchor">About</Link>
          <Link to="/tracks" className="nav-anchor">Tracks</Link>
          <Link to="/services" className="nav-anchor">Services</Link>
          <Link to="/book" className="nav-anchor">Book</Link>
        </div>
        {user ? (
          <>
            <span className="nav-user-pill">
              ◈ {user.name.split(' ')[0].toUpperCase()}
            </span>
            <Link to="/dashboard"><button type="button" className="btn btn-ghost btn-sm">PORTAL</button></Link>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => { logout(); navigate('/'); }}>EXIT</button>
          </>
        ) : (
          <>
            <Link to="/login"><button type="button" className="btn btn-ghost btn-sm">LOG IN</button></Link>
            <Link to="/register"><button type="button" className="btn btn-primary btn-sm">BOOK NOW</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
