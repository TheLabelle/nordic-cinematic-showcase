import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { NordicStar } from '@/components/nordik/brand';
import { SiteHeader, SiteFooter, FinalBooking, MobileBooking, ProjectGallery } from '@/components/nordik/site-ui';
import { copy, filterProjects, type Language, type Category } from '@/data/site';

export const Route = createFileRoute('/projets/')({
  validateSearch: (search: Record<string, unknown>): { lang: Language } => ({ lang: search['lang'] === 'en' ? 'en' : 'fr' }),
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) => {
    const en = loaderData?.lang === 'en';
    const title = en ? 'Projects — NORDIK MÉDIA' : 'Projets — NORDIK MÉDIA';
    const description = en ? 'Explore our real estate, corporate event and drone video portfolio in Greater Montreal.' : 'Découvrez nos projets vidéo immobiliers, événementiels et par drone dans le Grand Montréal.';
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:locale', content: en ? 'en_CA' : 'fr_CA' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { lang } = Route.useSearch();
  const t = copy[lang];
  const [category, setCategory] = useState<Category>('all');
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <div className="site">
    <SiteHeader lang={lang} />
    <main>
      <section className="section-wrap projects-section portfolio-section">
        <div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{t.portfolio}</p><h1>{t.projectTitle}</h1></div><span className="section-number">01 /</span></div>
        <div className="filters" aria-label={t.portfolio}>{(['all', 'real-estate', 'events'] as const).map((c, i) => <Button key={c} variant="ghost" className={`filter ${category === c ? 'selected' : ''}`} onClick={() => setCategory(c)} aria-pressed={category === c}>{t.filters[i]}<span>{String(filterProjects(c).length).padStart(2, '0')}</span></Button>)}</div>
        <ProjectGallery lang={lang} items={filterProjects(category)} />
      </section>
      <FinalBooking lang={lang} />
    </main>
    <SiteFooter lang={lang} />
    <MobileBooking lang={lang} />
  </div>;
}
