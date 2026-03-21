import { FEATURED_TRACKS, SPOTIFY_ARTIST_URL } from '../../data/patrickContent';
import SectionRule from './SectionRule';

export default function TracksSection() {
  return (
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
  );
}
