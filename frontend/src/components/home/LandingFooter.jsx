export default function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <span>© {year} Patrick Star</span>
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
  );
}
