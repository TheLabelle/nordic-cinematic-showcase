export function NordicStar({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 0 29 19 48 24 29 29 24 48 19 29 0 24 19 19Z" /></svg>;
}
export function Brand({ lang = 'fr' }: { lang?: 'fr' | 'en' }) {
  return <span className="brand"><NordicStar className="brand-star" /><span>NORDIK MÉDIA</span><span className="brand-caption">{lang === 'fr' ? 'PRODUCTION VIDÉO' : 'VIDEO PRODUCTION'}</span></span>;
}
