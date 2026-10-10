import { Link, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, Play, MapPin, Instagram, Facebook, Menu, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Brand, NordicStar } from '@/components/nordik/brand';
import { BOOKING_URL, copy, type Language, projects } from '@/data/site';

export function LanguageToggle({ lang }: { lang: Language }) {
 const pathname = useRouterState({ select: state => state.location.pathname });
 const to = pathname === '/projets' ? '/projets' : '/';
 return <div className="language-toggle" aria-label={lang === 'fr' ? 'Langue' : 'Language'}>{(['fr', 'en'] as const).map((l, i) => <span key={l}>{i > 0 && <span className="language-divider">|</span>}<Button asChild variant="ghost" className={lang === l ? 'language active' : 'language'}><Link to={to} search={prev => ({ ...prev, lang: l })} resetScroll={false} aria-current={lang === l ? 'true' : undefined}>{l.toUpperCase()}</Link></Button></span>)}</div>;
}
export function BookingButton({ lang, className = '' }: { lang: Language; className?: string }) {
 return <Button asChild className={`booking-button ${className}`}><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{copy[lang].quote}<ArrowUpRight /></a></Button>;
}
export function SiteHeader({ lang }: { lang: Language }) {
 const t = copy[lang];
 const [menuOpen, setMenuOpen] = useState(false);
 return <header className="site-header"><div className="header-inner"><Link to="/" search={{ lang }} hash="top" aria-label="NORDIK MÉDIA"><Brand lang={lang} /></Link><nav className="desktop-nav"><Link to="/" search={{ lang }} hash="projects">{t.projects}</Link><Link to="/projets" search={{ lang }}>{t.portfolio}</Link><Link to="/" search={{ lang }} hash="services">{t.services}</Link></nav><div className="header-actions"><LanguageToggle lang={lang} /><div className="desktop-booking"><BookingButton lang={lang} /></div><Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div></div>{menuOpen && <nav className="mobile-nav"><Link to="/" search={{ lang }} hash="projects" onClick={() => setMenuOpen(false)}>{t.projects}</Link><Link to="/projets" search={{ lang }} onClick={() => setMenuOpen(false)}>{t.portfolio}</Link><Link to="/" search={{ lang }} hash="services" onClick={() => setMenuOpen(false)}>{t.services}</Link></nav>}</header>;
}
export function FinalBooking({ lang }: { lang: Language }) {
 const t = copy[lang];
 return <section className="final-booking"><NordicStar className="final-star" /><p className="eyebrow">{t.next}</p><h2>{lang === 'fr' ? <>Réservez votre<br />soumission gratuite.</> : <>Book your<br />free quote.</>}</h2><BookingButton lang={lang} /></section>;
}
export function SiteFooter({ lang }: { lang: Language }) {
 const t = copy[lang];
 return <footer className="section-wrap footer"><div className="footer-main"><Link to="/" search={{ lang }} hash="top" aria-label="NORDIK MÉDIA"><Brand lang={lang} /></Link><p>{t.region}</p><div className="socials"><Button variant="ghost" size="icon" aria-label={`Instagram — ${t.social}`} title={`Instagram — ${t.social}`} disabled><Instagram size={18} /></Button><Button variant="ghost" size="icon" aria-label={`Facebook — ${t.social}`} title={`Facebook — ${t.social}`} disabled><Facebook size={18} /></Button></div></div><div className="footer-bottom"><p>© 2026 NORDIK MÉDIA. {t.rights}</p><LanguageToggle lang={lang} /></div></footer>;
}
export function MobileBooking({ lang }: { lang: Language }) {
 return <div className="mobile-booking-bar"><BookingButton lang={lang} /></div>;
}
export function ProjectGallery({ lang, items }: { lang: Language; items: typeof projects }) {
 const t = copy[lang];
 const [activeProject, setActiveProject] = useState<(typeof projects)[number] | null>(null);
 return <><div className="project-grid">{items.map(p => <article className="project" key={p.id}><Button variant="ghost" className="project-image-button group" aria-label={`${t.play} — ${p.title[lang]}`} onClick={() => setActiveProject(p)}><img src={p.thumbnail} width="1280" height="832" loading="lazy" alt={p.title[lang]} /><span className="location-tag"><MapPin size={11} />{p.location}</span><span className="play-icon"><Play size={19} fill="currentColor" /></span><span className="project-index">{String(p.id).padStart(2, '0')}</span></Button><div className="project-caption"><h3>{p.title[lang]}</h3><ArrowUpRight size={19} /></div><p>{p.description[lang]}</p></article>)}</div> <Dialog.Root open={activeProject !== null} onOpenChange={open => { if (!open) setActiveProject(null); }}><Dialog.Portal><Dialog.Overlay className="lightbox-overlay" /><Dialog.Content className="lightbox"><div className="lightbox-heading"><div><Dialog.Title>{activeProject?.title[lang]}</Dialog.Title><Dialog.Description>{t.sample}</Dialog.Description></div><Dialog.Close asChild><Button variant="ghost" size="icon" aria-label={t.close}><X /></Button></Dialog.Close></div>{activeProject && <iframe src={activeProject.videoUrl} title={activeProject.title[lang]} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" />}</Dialog.Content></Dialog.Portal></Dialog.Root></>;
}
