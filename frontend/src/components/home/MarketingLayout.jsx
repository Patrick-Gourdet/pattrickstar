import LandingFooter from './LandingFooter';

/** Wraps public marketing pages with shared footer navigation. */
export default function MarketingLayout({ children }) {
  return (
    <div className="landing-root">
      {children}
      <LandingFooter />
    </div>
  );
}
