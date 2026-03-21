import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HeroSection,
  AboutSection,
  TracksSection,
  ServicesSection,
  BookCtaSection,
  LandingFooter,
} from '../components/home';

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
      <HeroSection />
      <AboutSection />
      <TracksSection />
      <ServicesSection />
      <BookCtaSection />
      <LandingFooter />
    </div>
  );
}
