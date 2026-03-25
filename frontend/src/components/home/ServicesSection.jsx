import SectionRule from './SectionRule';

const SERVICE_CARDS = [
  { icon: '🎛️', name: 'DJ Set', desc: 'Club, bar, or festival. Tech house and minimal are home — but I read the room.', tag: 'Available', tagColor: 'var(--cyan)' },
  { icon: '🌙', name: 'Club Night', desc: 'Full night programming, open to close. Build the arc, hold the energy, end on a peak.', tag: 'Available', tagColor: 'var(--cyan)' },
  { icon: '⚡', name: 'Live PA', desc: 'Original material performed live. Request via the portal.', tag: 'Available', tagColor: 'var(--cyan)' },
];

export default function ServicesSection() {
  return (
    <section className="landing-section" aria-labelledby="services-heading">
      <div className="landing-inner">
        <SectionRule title="SERVICES" kicker="What I offer" />
        <h3 id="services-heading" className="visually-hidden">Services</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {SERVICE_CARDS.map((s) => (
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
  );
}
