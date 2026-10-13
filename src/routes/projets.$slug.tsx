import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { NordicStar } from '@/components/nordik/brand';
import { SiteHeader, SiteFooter, FinalBooking, MobileBooking } from '@/components/nordik/site-ui';
import { copy, findProject, imageAlt, type Language } from '@/data/site';

export const Route = createFileRoute('/projets/$slug')({
  validateSearch: (search: Record<string, unknown>): { lang: Language } => ({ lang: search['lang'] === 'en' ? 'en' : 'fr' }),
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ params, deps }) => {
    const project = findProject(params.slug);
    if (!project) throw notFound();
    return { lang: deps.lang, slug: project.slug };
  },
  head: ({ loaderData }) => {
    const project = loaderData ? findProject(loaderData.slug) : undefined;
    if (!loaderData || !project) return { meta: [{ title: 'Projet introuvable — NORDIK MÉDIA' }, { name: 'robots', content: 'noindex' }] };
    const lang = loaderData.lang;
    const title = `${project.title[lang]} — NORDIK MÉDIA`;
    const description = `${project.description[lang]} · ${project.location}`;
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'article' }, { property: 'og:locale', content: lang === 'en' ? 'en_CA' : 'fr_CA' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectDetail,
});

function ProjectNotFound() {
  return <div className="site"><main className="section-wrap detail-section"><h1 className="detail-title">Projet introuvable</h1><Link to="/projets" search={{ lang: 'fr' }} className="back-link">← Tous les projets</Link></main></div>;
}

function ProjectDetail() {
  const { lang } = Route.useSearch();
  const { slug } = Route.useParams();
  const project = findProject(slug);
  const t = copy[lang];
  const [photo, setPhoto] = useState<string | null>(null);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  if (!project) return <ProjectNotFound />;
  const title = project.title[lang];
  const work = project.work[lang];
  return <div className="site">
    <SiteHeader lang={lang} />
    <main>
      <section className="section-wrap detail-section">
        <Link to="/projets" search={{ lang }} className="back-link">{t.allProjects}</Link>
        <div className="detail-tags"><span className="location-tag"><MapPin size={11} />{project.location}</span><span className="location-tag">{t.categories[project.category]}</span></div>
        <h1 className="detail-title">{title}</h1>
        <div className="detail-layout">
          {project.videoUrl && <div className="detail-video"><iframe src={project.videoUrl} title={title} loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div>}
          <aside className="detail-info">
            <h2>{t.details}</h2>
            {project.body[lang].map((para, i) => <p key={i}>{para}</p>)}
            {work.length > 0 && <><h3>{t.workTitle}</h3><ul>{work.map(item => <li key={item}><NordicStar className="size-3" />{item}</li>)}</ul></>}
          </aside>
          {project.photos.length > 0 && <div className="detail-photos">{project.photos.map((src, i) => <button type="button" key={i} className="detail-photo" onClick={() => setPhoto(src)} aria-label={`${t.photo} ${i + 1} — ${title}`}><img src={src} width="1280" height="832" loading="lazy" alt={imageAlt(src, lang, `${title} — ${t.photo} ${i + 1}`)} /></button>)}</div>}
        </div>
      </section>
      <FinalBooking lang={lang} />
    </main>
    <SiteFooter lang={lang} />
    <MobileBooking lang={lang} />
    <Dialog.Root open={photo !== null} onOpenChange={open => { if (!open) setPhoto(null); }}><Dialog.Portal><Dialog.Overlay className="lightbox-overlay" /><Dialog.Content className="lightbox photo-lightbox"><div className="lightbox-heading"><Dialog.Title>{title}</Dialog.Title><Dialog.Description className="sr-only">{t.photo}</Dialog.Description><Dialog.Close asChild><Button variant="ghost" size="icon" aria-label={t.close}><X /></Button></Dialog.Close></div>{photo && <img src={photo} alt={imageAlt(photo, lang, title)} />}</Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>;
}
