import {
  FEATURED_TRACKS,
  SPOTIFY_ARTIST_URL,
  SOUNDCLOUD_PROFILE_URL,
  SOUNDCLOUD_PROFILE_EMBED_URL,
  SOUNDCLOUD_TRACKS,
  soundcloudPlayerSrc,
} from '../../data/patrickContent';
import SectionRule from './SectionRule';

export default function TracksSection() {
  const profileEmbedPermalink = (SOUNDCLOUD_PROFILE_EMBED_URL || SOUNDCLOUD_PROFILE_URL || '').trim();
  const profileEmbedSrc = profileEmbedPermalink ? soundcloudPlayerSrc(profileEmbedPermalink, { visual: true }) : '';
  const hasSoundcloud = Boolean(profileEmbedSrc || SOUNDCLOUD_TRACKS.length > 0);
  const hasSpotify = FEATURED_TRACKS.length > 0;

  return (
    <section className="landing-section landing-section--tracks" aria-labelledby="tracks-heading">
      <div className="landing-inner">
        <SectionRule title="TRACKS" kicker="Listen in" />
        <h3 id="tracks-heading" className="visually-hidden">Featured tracks</h3>

        {/* <p className="tracks-lead">
          SoundCloud and Spotify — set your profile, embed URL, and track links in{' '}
          <code className="tracks-code">src/data/patrickContent.js</code>.
        </p> */}

        {/* —— SoundCloud —— */}
        <div className="tracks-platform-block">
          <div className="tracks-platform-head">SoundCloud</div>

          {!hasSoundcloud && (
            <p className="tracks-footnote" style={{ marginBottom: '24px' }}>
              Add <code className="tracks-code">SOUNDCLOUD_PROFILE_URL</code> (and optionally{' '}
              <code className="tracks-code">SOUNDCLOUD_PROFILE_EMBED_URL</code>) plus{' '}
              <code className="tracks-code">SOUNDCLOUD_TRACKS</code> with full track URLs.
            </p>
          )}

          {profileEmbedSrc && (
            <div className="card track-card tracks-profile-card">
              <div className="track-card-head">
                <h4 className="track-card-title">Profile</h4>
                <p className="track-card-caption">Stream from Patrick&apos;s SoundCloud</p>
              </div>
              <div className="track-embed-wrap track-embed-wrap--profile">
                <iframe
                  title="SoundCloud profile"
                  style={{ borderRadius: 'var(--radius)', border: 'none' }}
                  width="100%"
                  height="450"
                  scrolling="no"
                  allow="autoplay"
                  src={profileEmbedSrc}
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {SOUNDCLOUD_TRACKS.length > 0 && (
            <div className="tracks-grid">
              {SOUNDCLOUD_TRACKS.map((t) => {
                const src = soundcloudPlayerSrc(t.url, { visual: true });
                if (!src) return null;
                return (
                  <div key={t.url} className="card track-card">
                    <div className="track-card-head">
                      <h4 className="track-card-title">{t.title}</h4>
                      {t.caption && <p className="track-card-caption">{t.caption}</p>}
                    </div>
                    <div className="track-embed-wrap">
                      <iframe
                        title={`SoundCloud — ${t.title}`}
                        style={{ borderRadius: 'var(--radius)', border: 'none' }}
                        width="100%"
                        height="300"
                        scrolling="no"
                        allow="autoplay"
                        src={src}
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="tracks-platform-head">SoundCloud Mixes</div>
          {SOUNDCLOUD_MIX.length > 0 && (
            <div className="tracks-grid">
              {SOUNDCLOUD_MIX.map((t) => {
                const src = soundcloudPlayerSrc(t.url, { visual: true });
                if (!src) return null;
                return (
                  <div key={t.url} className="card track-card">
                    <div className="track-card-head">
                      <h4 className="track-card-title">{t.title}</h4>
                      {t.caption && <p className="track-card-caption">{t.caption}</p>}
                    </div>
                    <div className="track-embed-wrap">
                      <iframe
                        title={`SoundCloud — ${t.title}`}
                        style={{ borderRadius: 'var(--radius)', border: 'none' }}
                        width="100%"
                        height="300"
                        scrolling="no"
                        allow="autoplay"
                        src={src}
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* —— Spotify —— */}
        {hasSpotify && (
          <div className="tracks-platform-block tracks-platform-block--spotify">
            <div className="tracks-platform-head">Spotify</div>
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
          </div>
        )}

        <div className="tracks-footer tracks-footer--split">
          {SOUNDCLOUD_PROFILE_URL ? (
            <a
              href={SOUNDCLOUD_PROFILE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-outline btn-sm"
            >
              SOUNDCLOUD PROFILE ↗
            </a>
          ) : null}
          {SPOTIFY_ARTIST_URL ? (
            <a href={SPOTIFY_ARTIST_URL} target="_blank" rel="noreferrer noopener" className="btn btn-outline btn-sm">
              SPOTIFY ↗
            </a>
          ) : null}
          {!SOUNDCLOUD_PROFILE_URL && !SPOTIFY_ARTIST_URL && (
            <p className="tracks-footnote" style={{ margin: 0 }}>
              Add <code className="tracks-code">SOUNDCLOUD_PROFILE_URL</code> and/or{' '}
              <code className="tracks-code">SPOTIFY_ARTIST_URL</code> for follow links.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
