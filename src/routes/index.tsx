import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDown, Play, Drone, Clapperboard, MapPin, Instagram, Facebook, Menu, X, Quote } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Brand, NordicStar } from '@/components/nordik/brand';
import { BOOKING_URL, copy, filterProjects, type Language, type Category, projects } from '@/data/site';
import hero from '@/assets/hero-house.jpg';
import heroVideo from '@/assets/hero-video.asset.json';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { lang: Language } => ({ lang: search.lang === 'en' ? 'en' : 'fr' }),
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
  const navigate = Route.useNavigate();
  const t = copy[lang];
  const [category, setCategory] = useState<Category>('all');
  const [activeProject, setActiveProject] = useState<(typeof projects)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setVideoReady(true); }, []);
  const setLanguage = (language: Language) => { navigate({ search: { lang: language }, resetScroll: false }); };
  const languageToggle = <div className="language-toggle" aria-label={lang === 'fr' ? 'Langue' : 'Language'}>{(['fr', 'en'] as const).map((l, i) => <span key={l}>{i > 0 && <span className="language-divider">|</span>}<Button variant="ghost" className={lang === l ? 'language active' : 'language'} aria-pressed={lang === l} onClick={() => setLanguage(l)}>{l.toUpperCase()}</Button></span>)}</div>;
  const booking = (className = '') => <Button asChild className={`booking-button ${className}`}><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{t.quote}<ArrowUpRight /></a></Button>;
  return <div className="site">
    <header className="site-header"><div className="header-inner"><a href="#top" aria-label="NORDIK MÉDIA"><Brand /></a><nav className="desktop-nav"><a href="#projects">{t.projects}</a><a href="#services">{t.services}</a></nav><div className="header-actions">{languageToggle}<div className="desktop-booking">{booking()}</div><Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div></div>{menuOpen && <nav className="mobile-nav"><a href="#projects" onClick={() => setMenuOpen(false)}>{t.projects}</a><a href="#services" onClick={() => setMenuOpen(false)}>{t.services}</a></nav>}</header>
    <main>
      <section id="top" className="hero"><img className="hero-media" src={hero} width="1920" height="1088" alt="" fetchPriority="high" />{videoReady && <video className="hero-media" autoPlay muted loop playsInline preload="none" poster={hero} aria-hidden="true"><source src={heroVideo.url} type="video/mp4" /></video>}<div className="hero-overlay" /><div className="hero-content"><div className="eyebrow"><NordicStar className="size-4" />{t.eyebrow}</div><h1>{lang === 'fr' ? <>Des vidéos<br />qui font vendre.</> : <>Video<br />that sells.</>}</h1><p>{t.sub}</p>{booking('hero-booking')}</div><a className="hero-discover" href="#projects"><ArrowDown size={16} />{t.discover}</a><div className="hero-side-note">IMMOBILIER / ÉVÉNEMENTIEL</div></section>
      <section id="projects" className="section-wrap projects-section"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.selected}</p><h2>{t.projectTitle}</h2></div><span className="section-number">01 /</span></div><div className="filters" aria-label={t.projects}>{(['all', 'real-estate', 'events'] as const).map((c, i) => <Button key={c} variant="ghost" className={`filter ${category === c ? 'selected' : ''}`} onClick={() => setCategory(c)} aria-pressed={category === c}>{t.filters[i]}<span>{c === 'all' ? '06' : c === 'events' ? '02' : '04'}</span></Button>)}</div><div className="project-grid">{filterProjects(category).map(p => <article className="project" key={p.id}><Button variant="ghost" className="project-image-button group" aria-label={`${t.play} — ${p.title[lang]}`} onClick={() => setActiveProject(p)}><img src={p.thumbnail} width="1280" height="832" loading="lazy" alt={p.title[lang]} /><span className="location-tag"><MapPin size={11} />{p.location}</span><span className="play-icon"><Play size={19} fill="currentColor" /></span><span className="project-index">0{p.id}</span></Button><div className="project-caption"><h3>{p.title[lang]}</h3><ArrowUpRight size={19} /></div><p>{p.description[lang]}</p></article>)}</div></section>
      <section id="services" className="services-section"><div className="section-wrap"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.expertise}</p><h2>{t.serviceTitle}</h2></div><span className="section-number">02 /</span></div><div className="services-grid">{t.serviceItems.map((s, i) => <article className="service" key={s.title}>{i === 0 ? <Drone size={35} strokeWidth={1} /> : <Clapperboard size={35} strokeWidth={1} />}<div><h3>{s.title}</h3><p>{s.text}</p></div><NordicStar className="service-star" /></article>)}</div></div></section>
      <section className="section-wrap testimonials-section"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.clients}</p><h2>{t.testimonialTitle}</h2></div><span className="section-number">03 /</span></div><div className="testimonials-grid">{t.roles.map((role, i) => <article key={i} className="testimonial"><Quote size={22} strokeWidth={1} /><p>{t.placeholder}</p><div><span>{t.name}</span><small>{role}</small></div></article>)}</div></section>
      <section className="logistics"><MapPin size={24} strokeWidth={1} /><div><p className="eyebrow">{t.area}</p><p>{t.region}</p></div><NordicStar className="logistics-star" /></section>
      <section className="final-booking"><NordicStar className="final-star" /><p className="eyebrow">{t.next}</p><h2>{lang === 'fr' ? <>Réservez votre<br />soumission gratuite.</> : <>Book your<br />free quote.</>}</h2>{booking()}</section>
    </main>
    <footer className="section-wrap footer"><div className="footer-main"><a href="#top" aria-label="NORDIK MÉDIA"><Brand /></a><p>{t.region}</p><div className="socials"><Button variant="ghost" size="icon" aria-label={`Instagram — ${t.social}`} title={`Instagram — ${t.social}`} disabled><Instagram size={18} /></Button><Button variant="ghost" size="icon" aria-label={`Facebook — ${t.social}`} title={`Facebook — ${t.social}`} disabled><Facebook size={18} /></Button></div></div><div className="footer-bottom"><p>© 2026 NORDIK MÉDIA. {t.rights}</p>{languageToggle}</div></footer>
    <div className="mobile-booking-bar">{booking()}</div>
    <Dialog.Root open={activeProject !== null} onOpenChange={open => { if (!open) setActiveProject(null); }}><Dialog.Portal><Dialog.Overlay className="lightbox-overlay" /><Dialog.Content className="lightbox"><div className="lightbox-heading"><div><Dialog.Title>{activeProject?.title[lang]}</Dialog.Title><Dialog.Description>{t.sample}</Dialog.Description></div><Dialog.Close asChild><Button variant="ghost" size="icon" aria-label={t.close}><X /></Button></Dialog.Close></div>{activeProject && <iframe src={activeProject.videoUrl} title={activeProject.title[lang]} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" />}</Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>;
}
