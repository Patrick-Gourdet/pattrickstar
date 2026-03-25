import { Link } from 'react-router-dom';

export default function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <span>© {year} Pattrick Star</span>
        <span className="landing-footer-dot">·</span>
        <Link to="/about">About</Link>
        <span className="landing-footer-dot">·</span>
        <Link to="/tracks">Tracks</Link>
        <span className="landing-footer-dot">·</span>
        <Link to="/services">Services</Link>
        <span className="landing-footer-dot">·</span>
        <Link to="/book">Book</Link>
        <span className="landing-footer-dot">·</span>
        <span>Powered by heart &amp; bass</span>
      </div>
    </footer>
  );
}
