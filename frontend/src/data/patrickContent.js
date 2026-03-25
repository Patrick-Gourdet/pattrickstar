/**
 * Public site copy & embeds for Patrick Star — edit URLs and IDs below.
 *
 * Spotify: Share → Embed → copy track ID from open.spotify.com/embed/track/THIS
 * SoundCloud: use the browser URL for your profile or each track (soundcloud.com/…)
 */

/** Builds SoundCloud widget iframe `src` from a track or profile permalink. */
export function soundcloudPlayerSrc(permalink, options = {}) {
  if (!permalink?.trim()) return '';
  const {
    visual = true,
    color = '00f5ff',
    hideRelated = true,
    showComments = false,
  } = options;
  const hex = color.replace(/^#/, '');
  const params = new URLSearchParams({
    url: permalink.trim(),
    color: `#${hex}`,
    auto_play: 'false',
    hide_related: String(hideRelated),
    show_comments: String(showComments),
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'true',
    visual: String(visual),
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

/** Your SoundCloud profile — opens “Visit profile” and can power the large embed. */
export const SOUNDCLOUD_PROFILE_URL = 'https://soundcloud.com/user-112294032-730314017';

/** Embed URL for the profile player; if empty, SOUNDCLOUD_PROFILE_URL is used when set. */
export const SOUNDCLOUD_PROFILE_EMBED_URL = '';

/**
 * SoundCloud tracks — each `url` is the full track link from the address bar.
 * Example: { title: 'My mix', caption: 'Live cut', url: 'https://soundcloud.com/you/slug' }
 */
export const SOUNDCLOUD_TRACKS = [  
  { title: 'To the Moon and Back', caption: 'Smooth Groove', url: 'https://soundcloud.com/user-112294032-730314017/to-the-moon-and-back' },
  { title: 'Big Booty Bae', caption: 'Tech house with a Miami vibe', url: 'https://soundcloud.com/user-112294032-730314017/big-booty-bae-extended' },
  { title: 'Demons and Angels', caption: 'Tech house with a Miami vibe', url: 'https://soundcloud.com/user-112294032-730314017/demons-and-angels' },
  { title: 'Think Different', caption: '', url: 'https://soundcloud.com/user-112294032-730314017/think-different' },];

export const SOUNDCLOUD_MIX = [
{ title: 'On The Fly', caption: 'Tech house with a Miami vibe', url: 'https://soundcloud.com/user-112294032-730314017/on-the-fly' },
  { title: 'Patrick Star Sarro Flow', caption: '', url: 'https://soundcloud.com/user-112294032-730314017/patrick-star-sarro-flow' },
  {title: 'For the DJs', caption: '', url: 'https://soundcloud.com/user-112294032-730314017/forthedjs' },
  {title: 'Need to Dance', caption: '', url: 'https://soundcloud.com/user-112294032-730314017/soundcloud' },
 ];
/** Set to your Spotify artist URL when live — button hides if empty. */
export const SPOTIFY_ARTIST_URL = '';

/** Featured Spotify track IDs (from share link: open.spotify.com/track/THIS_PART) */
export const FEATURED_TRACKS = [

];

export const BIO_PARAGRAPHS = [
  "I'm Pattrick Star — DJ, performer, and storyteller behind the decks. Based in the rhythm of Miami nights, I grew up obsessed with the moment a room locks in: when the kick hits and nobody checks their phone.",
  "My sound lives in tech house and minimal, with detours through afro house and open format when the crowd needs it. I'm not here to play the same safe playlist every weekend — I read the room, build tension, and earn the release.",
  'Outside the club, I care about connection. Music is one of the few things that still makes strangers feel like they belong to the same moment. That idea — making people feel less alone on a dance floor — is the whole reason I do this.',
  'Whether it is a club night, a private event, or a festival slot, I show up prepared, professional, and ready to go deep. Let us build something people will talk about on the ride home.',
];
