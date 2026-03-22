import { Link } from 'react-router-dom';
import { BIO_PARAGRAPHS } from '../../data/patrickContent';
import SectionRule from './SectionRule';

export default function AboutSection() {
  return (
    <section className="landing-section" aria-labelledby="about-heading">
      <div className="landing-inner">
        <SectionRule title="ABOUT" kicker="Patrick Star" />
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
              <Link to="/tracks">
                <button type="button" className="btn btn-ghost btn-sm">HEAR TRACKS</button>
              </Link>
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
  );
}
