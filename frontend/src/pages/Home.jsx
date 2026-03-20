import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BIO_PARAGRAPHS, FEATURED_TRACKS, SPOTIFY_ARTIST_URL } from '../data/patrickContent';

function SectionRule({ title, kicker, id }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }} id={id}>
      <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: 'var(--white)', whiteSpace: 'nowrap' }}>{title}</h2>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(0,245,255,0.45), transparent)', minWidth: '80px' }} />
      {kicker && (
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--grey)', textTransform: 'uppercase' }}>
          {kicker}
        </span>
      )}
    </div>
  );
}

export default function Home() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname !== '/' || !hash) return;
    const id = hash.replace('#', '');
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [pathname, hash]);

  return (
    <div className="landing-root">
      {/* —— HERO —— */}
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

      {/* —— ABOUT / BIO —— */}
      <section className="landing-section" aria-labelledby="about-heading">
        <div className="landing-inner">
          <SectionRule id="about" title="ABOUT" kicker="Patrick Star" />
          <h3 id="about-heading" className="visually-hidden">About Patrick Star</h3>

          <div className="bio-layout">
            <div className="card card-glow-cyan bio-panel bio-panel--intro">
              <div className="bio-accent-bar" />
              <p className="bio-tagline" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.05rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: '20px' }}>
                Miami · House · After midnight
              </p>
              {BIO_PARAGRAPHS.map((p, i) => (
                <p key={i} className="bio-text">
                  {p}
                </p>
              ))}
              <div className="neon-divider" style={{ margin: '28px 0' }} />
              <p className="bio-text" style={{ fontStyle: 'italic', color: 'var(--grey-light)' }}>
                — Book a date through the client portal when you are ready to work together.
              </p>
              <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link to="/register">
                  <button type="button" className="btn btn-primary btn-sm">START A REQUEST</button>
                </Link>
                <a href="#tracks">
                  <button type="button" className="btn btn-ghost btn-sm">HEAR TRACKS</button>
                </a>
              </div>
            </div>

            <aside className="bio-aside">
              <div className="card bio-stat-card">
                <div className="section-title" style={{ marginBottom: '16px', fontSize: '1.15rem' }}>AT A GLANCE</div>
                <ul className="bio-facts">
                  <li><strong>Sound</strong> Tech house, minimal, afro house, open format</li>
                  <li><strong>Formats</strong> Clubs, festivals, private &amp; corporate</li>
                  <li><strong>Focus</strong> Room reading, long arcs, peak moments</li>
                  <li><strong>Based</strong> Miami — travel by arrangement</li>
                </ul>
              </div>
              <div className="card card-glow-magenta bio-quote">
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', lineHeight: 1.55, color: 'var(--white)', fontStyle: 'italic' }}>
                  "The best nights are not about showing off — they are about everyone forgetting what time it is."
                </p>
                <p style={{ marginTop: '14px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--magenta)' }}>— Patrick Star</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* —— TRACKS —— */}
      <section className="landing-section landing-section--tracks" aria-labelledby="tracks-heading">
        <div className="landing-inner">
          <SectionRule id="tracks" title="TRACKS" kicker="Listen in" />
          <h3 id="tracks-heading" className="visually-hidden">Featured tracks</h3>

          <p className="tracks-lead">
            A few cuts in heavy rotation — swap the Spotify IDs in <code className="tracks-code">src/data/patrickContent.js</code> for your own releases and remixes.
          </p>

          <div className="tracks-grid">
            {FEATURED_TRACKS.map((t) => (
              <div key={t.spotifyTrackId} className="card track-card">
                <div className="track-card-head">
                  <h4 className="track-card-title">{t.title}</h4>
                  <p className="track-card-caption">{t.caption}</p>
                </div>
                <div className="track-embed-wrap">
                  <iframe
                    title={`Spotify — ${t.title}`}
                    style={{ borderRadius: 'var(--radius)', border: 'none' }}
                    src={`https://open.spotify.com/embed/track/${t.spotifyTrackId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="tracks-footer">
            {SPOTIFY_ARTIST_URL ? (
              <a href={SPOTIFY_ARTIST_URL} target="_blank" rel="noreferrer noopener" className="btn btn-outline btn-sm">
                FOLLOW ON SPOTIFY ↗
              </a>
            ) : (
              <p className="tracks-footnote">Add <code className="tracks-code">SPOTIFY_ARTIST_URL</code> in patrickContent.js to show a follow button.</p>
            )}
          </div>
        </div>
      </section>

      {/* —— SERVICES —— */}
      <section className="landing-section" id="services" aria-labelledby="services-heading">
        <div className="landing-inner">
          <SectionRule title="SERVICES" kicker="What I offer" />
          <h3 id="services-heading" className="visually-hidden">Services</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🎛️', name: 'DJ Set', desc: 'Club, bar, or festival. Tech house and minimal are home — but I read the room.', tag: 'Available', tagColor: 'var(--cyan)' },
              { icon: '🌙', name: 'Club Night', desc: 'Full night programming, open to close. Build the arc, hold the energy, end on a peak.', tag: 'Available', tagColor: 'var(--cyan)' },
              { icon: '🎉', name: 'Private Event', desc: 'Weddings, birthday parties, brand activations. Curated for your guests.', tag: 'Available', tagColor: 'var(--cyan)' },
              { icon: '🏢', name: 'Corporate', desc: 'Tasteful, professional, and still actually fun. Sets designed for the room.', tag: 'Available', tagColor: 'var(--cyan)' },
              { icon: '🎤', name: 'MC / Host', desc: 'Stage presence, crowd interaction, event hosting.', tag: 'Available', tagColor: 'var(--cyan)' },
              { icon: '⚡', name: 'Live PA', desc: 'Original material performed live. Request via the portal.', tag: 'Available', tagColor: 'var(--cyan)' },
            ].map((s) => (
              <div key={s.name} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--cyan), transparent)', opacity: 0.6 }} />
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--white)' }}>{s.name}</h3>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: s.tagColor, border: `1px solid ${s.tagColor}`, padding: '2px 8px', borderRadius: '2px', opacity: 0.9 }}>{s.tag}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--grey-light)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— CTA —— */}
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

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span>© {new Date().getFullYear()} Patrick Star</span>
          <span className="landing-footer-dot">·</span>
          <a href="#about">About</a>
          <span className="landing-footer-dot">·</span>
          <a href="#tracks">Tracks</a>
          <span className="landing-footer-dot">·</span>
          <a href="#services">Services</a>
          <span className="landing-footer-dot">·</span>
          <a href="#book">Book</a>
          <span className="landing-footer-dot">·</span>
          <span>Powered by heart &amp; bass</span>
        </div>
      </footer>
    </div>
  );
}
