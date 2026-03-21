export default function SectionRule({ title, kicker, id }) {
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
