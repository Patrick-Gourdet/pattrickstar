import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-eyebrow">
        <span>DJ</span>
        <span>·</span>
        <span>PERFORMER</span>
        <span>·</span>
        <span>ENTERTAINER</span>
      </div>

      <h1>
        PATRICK
        <span className="name-star">STAR</span>
      </h1>

      <p className="hero-mission">
        "I didn't come to play it safe — I came to create things that make people{' '}
        <em>feel less lonely</em>."
      </p>

      <div className="hero-buttons">
        <Link to="/register">
          <button type="button" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1rem' }}>
            ★ REQUEST A BOOKING
          </button>
        </Link>
        <Link to="/login">
          <button type="button" className="btn btn-outline" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            CLIENT PORTAL
          </button>
        </Link>
      </div>

      <div className="hero-features">
        <div className="feature-item">
          <span className="feature-icon">🎛️</span>
          <h3>DJ SETS</h3>
          <p>Tech house · Minimal · Afro house · Open format. Custom sets built for your crowd.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🎤</span>
          <h3>LIVE EVENTS</h3>
          <p>Club nights, festivals, private events, corporate — every room gets treated differently.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">📅</span>
          <h3>EASY BOOKING</h3>
          <p>Add your venue, request a time slot, track your booking status in real time.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔊</span>
          <h3>DEEPER COLLABS</h3>
          <p>MC / host and live PA are on the menu — plus residencies and consulting as we grow.</p>
        </div>
      </div>

      <a href="#about" className="hero-scroll-cue">
        <span className="hero-scroll-cue-label">Bio &amp; story</span>
        <span className="hero-scroll-cue-arrow" aria-hidden>↓</span>
      </a>
    </section>
  );
}
