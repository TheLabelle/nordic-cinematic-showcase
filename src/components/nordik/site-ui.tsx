import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowUpRight, MapPin, Instagram, Facebook, Menu, X, Drone, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Brand, NordicStar } from '@/components/nordik/brand';
import { SERVICE_CITIES, copy, imageAlt, type Language, projects } from '@/data/site';

export function LanguageToggle({ lang }: { lang: Language }) {
  return <div className="language-toggle" aria-label={lang === 'fr' ? 'Langue' : 'Language'}>{(['fr', 'en'] as const).map((l, i) => <span key={l}>{i > 0 && <span className="language-divider">|</span>}<Button asChild variant="ghost" className={lang === l ? 'language active' : 'language'}><Link to="." search={prev => ({ ...prev, lang: l })} resetScroll={false} aria-current={lang === l ? 'true' : undefined}>{l.toUpperCase()}</Link></Button></span>)}</div>;
}
export function BookingButton({ lang, className = '', label }: { lang: Language; className?: string; label?: string }) {
 return <Button asChild className={`booking-button ${className}`}><Link to="/soumission" search={{ lang }}>{label ?? copy[lang].quote}<ArrowUpRight /></Link></Button>;
}
export function SiteHeader({ lang }: { lang: Language }) {
 const t = copy[lang];
 const [menuOpen, setMenuOpen] = useState(false);
 return <header className="site-header"><div className="header-inner"><Link to="/" search={{ lang }} hash="top" aria-label="NORDIK MÉDIA"><Brand lang={lang} /></Link><nav className="desktop-nav"><NavLinks lang={lang} /></nav><div className="header-actions"><LanguageToggle lang={lang} /><div className="desktop-booking"><BookingButton lang={lang} /></div><Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div></div>{menuOpen && <nav className="mobile-nav"><NavLinks lang={lang} onNavigate={() => setMenuOpen(false)} /></nav>}</header>;
}
function NavLinks({ lang, onNavigate }: { lang: Language; onNavigate?: () => void }) {
 const t = copy[lang];
 return <><Link to="/services" search={{ lang }} onClick={onNavigate}>{t.services}</Link><Link to="/projets" search={{ lang }} onClick={onNavigate}>{t.projects}</Link><Link to="/forfaits" search={{ lang }} onClick={onNavigate}>{t.packagesNav}</Link><Link to="/soumission" search={{ lang }} onClick={onNavigate}>{t.quoteNav}</Link></>;
}
export function FinalBooking({ lang }: { lang: Language }) {
 const t = copy[lang];
 return <section className="final-booking"><NordicStar className="final-star" /><p className="eyebrow">{t.next}</p><h2>{lang === 'fr' ? <>Parlons de votre<br />prochain projet.</> : <>Let’s talk about<br />your next project.</>}</h2><BookingButton lang={lang} label={t.finalCta} /></section>;
}
export function ExpertiseList({ lang }: { lang: Language }) {
 return <div className="services-grid">{copy[lang].serviceItems.map((s, i) => <article className="service" key={s.title}>{i === 0 ? <Drone size={35} strokeWidth={1} /> : <Clapperboard size={35} strokeWidth={1} />}<div className="service-content"><h3>{s.title}</h3><ul className="service-bullets">{s.bullets.map((b, idx) => <li key={idx} className="service-bullet"><NordicStar className="service-bullet-star" /><span className="service-bullet-text">{b}</span></li>)}</ul></div><NordicStar className="service-star" /></article>)}</div>;
}
export function WhyChooseUs({ lang, number }: { lang: Language; number: string }) {
 const t = copy[lang];
 return <section className="section-wrap why-section"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.whyEyebrow}</p><h2>{t.whyTitle}</h2></div><span className="section-number">{number} /</span></div><ul className="why-grid">{t.whyItems.map((item, i) => <li key={i} className="why-item"><NordicStar className="why-star" /><p>{item}</p></li>)}</ul></section>;
}
export function ServiceArea({ lang }: { lang: Language }) {
 const t = copy[lang];
 return <section className="logistics"><MapPin size={24} strokeWidth={1} /><div><p className="eyebrow">{t.area}</p><p>{t.region}</p><ul className="service-cities">{SERVICE_CITIES.map(city => <li key={city}>{city}</li>)}</ul></div><NordicStar className="logistics-star" /></section>;
}
export function SiteFooter({ lang }: { lang: Language }) {
 const t = copy[lang];
 return <footer className="section-wrap footer"><div className="footer-main"><Link to="/" search={{ lang }} hash="top" aria-label="NORDIK MÉDIA"><Brand lang={lang} /></Link><p>{t.region}</p><div className="socials"><Button variant="ghost" size="icon" aria-label={`Instagram — ${t.social}`} title={`Instagram — ${t.social}`} disabled><Instagram size={18} /></Button><Button variant="ghost" size="icon" aria-label={`Facebook — ${t.social}`} title={`Facebook — ${t.social}`} disabled><Facebook size={18} /></Button></div></div><div className="footer-bottom"><p>© 2026 NORDIK MÉDIA. {t.rights}</p><LanguageToggle lang={lang} /></div></footer>;
}
// With revealAfterId, the sticky bar stays hidden until that element (e.g. the hero button) has scrolled above the viewport.
export function MobileBooking({ lang, revealAfterId }: { lang: Language; revealAfterId?: string }) {
 const [visible, setVisible] = useState(!revealAfterId);
 useEffect(() => {
  if (!revealAfterId) return;
  const target = document.getElementById(revealAfterId);
  if (!target) { setVisible(true); return; }
  const observer = new IntersectionObserver(([entry]) => { if (entry) setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0); });
  observer.observe(target);
  return () => observer.disconnect();
 }, [revealAfterId]);
 return <div className={`mobile-booking-bar ${visible ? '' : 'is-hidden'}`} aria-hidden={!visible} inert={!visible}><BookingButton lang={lang} /></div>;
}
export function ProjectGallery({ lang, items }: { lang: Language; items: typeof projects }) {
 const t = copy[lang];
 if (items.length === 0) return <p className="project-empty">{t.emptyCategory}</p>;
 return <div className="project-grid">{items.map(p => <article className="project" key={p.id}><Link to="/projets/$slug" params={{ slug: p.slug }} search={{ lang }} className="project-image-button group" aria-label={`${t.play} — ${p.title[lang]}`}><img src={p.thumbnail} width="1280" height="832" loading="lazy" alt={imageAlt(p.thumbnail, lang, p.description[lang])} /><span className="location-tag"><MapPin size={11} />{p.location}</span><span className="play-icon"><ArrowUpRight size={19} /></span><span className="project-index">{String(p.id).padStart(2, '0')}</span></Link><div className="project-caption"><h3>{p.title[lang]}</h3></div><p>{p.description[lang]}</p><Link to="/projets/$slug" params={{ slug: p.slug }} search={{ lang }} className="view-project">{t.viewProject}</Link></article>)}</div>;
}
