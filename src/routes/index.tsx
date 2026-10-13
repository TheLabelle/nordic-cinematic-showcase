import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Quote, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NordicStar } from '@/components/nordik/brand';
import { HERO_VIDEO_URL, copy, imageAlt, featuredProjects, testimonials, type Language } from '@/data/site';
import { BookingButton, SiteHeader, SiteFooter, FinalBooking, MobileBooking, ProjectGallery, ExpertiseList, WhyChooseUs, ServiceArea } from '@/components/nordik/site-ui';
import hero from '@/assets/hero-house.jpg';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { lang: Language } => ({ lang: search['lang'] === 'en' ? 'en' : 'fr' }),
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) => {
    const en = loaderData?.lang === 'en';
    const title = en ? 'NORDIK MÉDIA — Video production on Montreal’s North Shore' : 'NORDIK MÉDIA — Production vidéo sur la Rive-Nord de Montréal';
    const description = en ? 'High-end video production on Montreal’s North Shore: real estate, businesses, builders and events. Laval, Terrebonne, Blainville, Mirabel and Saint-Jérôme. Free quote.' : 'Production vidéo haut de gamme sur la Rive-Nord de Montréal : immobilier, entreprises, constructeurs et événements. Laval, Terrebonne, Blainville, Mirabel et Saint-Jérôme. Soumission gratuite.';
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:locale', content: en ? 'en_CA' : 'fr_CA' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  component: Index,
});

function Index() {
  const { lang } = Route.useSearch();
  const t = copy[lang];
  // The poster image is always rendered; the video is added after load on larger screens only,
  // so phones, reduced-motion users and failed loads keep the still image.
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    if (!HERO_VIDEO_URL) return;
    const desktop = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const update = () => setShowVideo(desktop.matches);
    update();
    desktop.addEventListener('change', update);
    return () => desktop.removeEventListener('change', update);
  }, []);

  return <div className="site">
    <SiteHeader lang={lang} />
    <main>
      <section id="top" className="hero"><img className="hero-media" src={hero} width="1920" height="1088" alt={imageAlt(hero, lang)} fetchPriority="high" />{showVideo && <video className="hero-media" autoPlay muted loop playsInline preload="auto" poster={hero} aria-hidden="true" onError={() => setShowVideo(false)}><source src={HERO_VIDEO_URL} type="video/mp4" onError={() => setShowVideo(false)} /></video>}<div className="hero-overlay" /><div className="hero-content"><div className="eyebrow"><NordicStar className="size-4" />{t.eyebrow}</div><h1>{lang === 'fr' ? <>Des vidéos qui font vendre,<br />louer et rayonner.</> : <>Video that sells,<br />leases and shines.</>}</h1><p>{t.sub}</p><div className="hero-actions" id="hero-cta"><BookingButton lang={lang} className="hero-booking" label={t.heroCta} /><Button asChild variant="outline" className="hero-secondary"><Link to="/projets" search={{ lang }}>{t.heroSecondary}</Link></Button></div></div><div className="hero-side-note">{lang === 'fr' ? 'IMMOBILIER / ÉVÉNEMENTIEL' : 'REAL ESTATE / EVENTS'}</div></section>
      <section id="intro" className="intro-section"><h2>{t.introTitle}</h2><p>{t.introP1}</p><p>{t.introP2}</p></section>
      <section id="projects" className="section-wrap projects-section"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.selected}</p><h2>{t.projectTitle}</h2></div><span className="section-number">01 /</span></div><ProjectGallery lang={lang} items={featuredProjects()} /><div className="all-projects"><Button asChild className="booking-button all-projects-button"><Link to="/projets" search={{ lang }}>{t.viewAll}<ArrowUpRight /></Link></Button></div></section>
      <section id="services" className="services-section"><div className="section-wrap"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.expertise}</p><h2>{t.serviceTitle}</h2></div><span className="section-number">02 /</span></div><ExpertiseList lang={lang} /></div></section>
      <WhyChooseUs lang={lang} number="03" />
      <section className="section-wrap testimonials-section"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.clients}</p><h2>{t.testimonialTitle}</h2></div><span className="section-number">04 /</span></div><div className="testimonials-grid">{testimonials.map((item, i) => <article key={i} className="testimonial"><Quote size={22} strokeWidth={1} /><p>{item.quote[lang]}</p><div><span>{item.author[lang]}</span><small>{item.role[lang]}</small></div></article>)}</div></section>
      <ServiceArea lang={lang} />
      <FinalBooking lang={lang} />
    </main>
    <SiteFooter lang={lang} />
    <MobileBooking lang={lang} revealAfterId="hero-cta" />
  </div>;
}
