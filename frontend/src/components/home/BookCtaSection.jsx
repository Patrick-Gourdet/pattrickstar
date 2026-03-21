import { Link } from 'react-router-dom';

export default function BookCtaSection() {
  return (
    <section className="landing-section landing-cta" id="book" aria-labelledby="book-heading">
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <h2 id="book-heading" className="visually-hidden">Book Patrick Star</h2>
      <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '16px', color: 'var(--white)', position: 'relative' }}>
        READY TO MAKE <span style={{ color: 'var(--cyan)', textShadow: 'var(--cyan-glow)' }}>NOISE?</span>
      </h2>
      <p style={{ color: 'var(--grey-light)', marginBottom: '32px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', letterSpacing: '0.05em', position: 'relative', maxWidth: '520px', margin: '0 auto 32px' }}>
        Add your venue, pick a date, and let&apos;s build something that moves people.
      </p>
      <Link to="/register" style={{ position: 'relative' }}>
        <button type="button" className="btn btn-magenta" style={{ padding: '14px 48px', fontSize: '1rem' }}>
          ★ START A BOOKING REQUEST
        </button>
      </Link>
    </section>
  );
}
