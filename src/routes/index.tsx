import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowDown, Drone, Clapperboard, MapPin, Quote, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NordicStar } from '@/components/nordik/brand';
import { copy, featuredProjects, type Language } from '@/data/site';
import { BookingButton, SiteHeader, SiteFooter, FinalBooking, MobileBooking, ProjectGallery } from '@/components/nordik/site-ui';
import hero from '@/assets/hero-house.jpg';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { lang: Language } => ({ lang: search['lang'] === 'en' ? 'en' : 'fr' }),
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) => {
    const en = loaderData?.lang === 'en';
    const title = en ? 'NORDIK MÉDIA — Real estate & event video' : 'NORDIK MÉDIA — Vidéo immobilière et événementielle';
    const description = en ? 'Real estate, corporate event and drone video in Greater Montreal. South Shore and North Shore. Book your free quote.' : 'Production vidéo immobilière, événementielle et par drone dans le Grand Montréal. Rive-Sud et Rive-Nord. Réservez votre soumission gratuite.';
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:locale', content: en ? 'en_CA' : 'fr_CA' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  component: Index,
});

function Index() {
  const { lang } = Route.useSearch();
  const t = copy[lang];
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setVideoReady(true); }, []);
  return <div className="site">
    <SiteHeader lang={lang} />
    <main>
      <section id="top" className="hero"><img className="hero-media" src={hero} width="1920" height="1088" alt="" fetchPriority="high" />{videoReady && <video className="hero-media" autoPlay muted loop playsInline preload="none" poster={hero} aria-hidden="true"><source src={heroVideo.url} type="video/mp4" /></video>}<div className="hero-overlay" /><div className="hero-content"><div className="eyebrow"><NordicStar className="size-4" />{t.eyebrow}</div><h1>{lang === 'fr' ? <>Des vidéos<br />qui font vendre.</> : <>Video<br />that sells.</>}</h1><p>{t.sub}</p><BookingButton lang={lang} className="hero-booking" /></div><a className="hero-discover" href="#projects"><ArrowDown size={16} />{t.discover}</a><div className="hero-side-note">{lang === 'fr' ? 'IMMOBILIER / ÉVÉNEMENTIEL' : 'REAL ESTATE / EVENTS'}</div></section>
      <section id="intro" className="intro-section"><h2>{t.introTitle}</h2><p>{t.introP1}</p><p>{t.introP2}</p></section>
      <section id="projects" className="section-wrap projects-section"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.selected}</p><h2>{t.projectTitle}</h2></div><span className="section-number">01 /</span></div><ProjectGallery lang={lang} items={featuredProjects()} /><div className="all-projects"><Button asChild className="booking-button all-projects-button"><Link to="/projets" search={{ lang }}>{t.viewAll}<ArrowUpRight /></Link></Button></div></section>
      <section id="services" className="services-section"><div className="section-wrap"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.expertise}</p><h2>{t.serviceTitle}</h2></div><span className="section-number">02 /</span></div><div className="services-grid">{t.serviceItems.map((s, i) => <article className="service" key={s.title}>{i === 0 ? <Drone size={35} strokeWidth={1} /> : <Clapperboard size={35} strokeWidth={1} />}<div className="service-content"><h3>{s.title}</h3><ul className="service-bullets">{s.bullets.map((b, idx) => <li key={idx} className="service-bullet"><NordicStar className="service-bullet-star" /><span className="service-bullet-text">{b}</span></li>)}</ul></div><NordicStar className="service-star" /></article>)}</div></div></section>
      <section className="section-wrap testimonials-section"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.clients}</p><h2>{t.testimonialTitle}</h2></div><span className="section-number">03 /</span></div><div className="testimonials-grid">{t.roles.map((role, i) => <article key={i} className="testimonial"><Quote size={22} strokeWidth={1} /><p>{t.placeholder}</p><div><span>{t.name}</span><small>{role}</small></div></article>)}</div></section>
      <section className="logistics"><MapPin size={24} strokeWidth={1} /><div><p className="eyebrow">{t.area}</p><p>{t.region}</p></div><NordicStar className="logistics-star" /></section>
      <FinalBooking lang={lang} />
    </main>
    <SiteFooter lang={lang} />
    <MobileBooking lang={lang} />
  </div>;
}
