import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NordicStar } from '@/components/nordik/brand';
import { SiteHeader, SiteFooter, FinalBooking, MobileBooking, ServiceArea } from '@/components/nordik/site-ui';
import { OWNER_PHOTOS, copy, type Language } from '@/data/site';

export const Route = createFileRoute('/a-propos')({
  validateSearch: (search: Record<string, unknown>): { lang: Language } => ({ lang: search['lang'] === 'en' ? 'en' : 'fr' }),
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) => {
    const en = loaderData?.lang === 'en';
    const title = en ? 'About — Video production on Montreal’s North Shore — NORDIK MÉDIA' : 'À propos — Production vidéo sur la Rive-Nord de Montréal — NORDIK MÉDIA';
    const description = en ? 'Meet the two co-owners of Nordik Média, a video production company on Montreal’s North Shore: our story, our equipment and our approach.' : 'Découvrez les deux copropriétaires de Nordik Média, entreprise de production vidéo de la Rive-Nord de Montréal : notre parcours, notre équipement et notre approche.';
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:locale', content: en ? 'en_CA' : 'fr_CA' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  component: AboutPage,
});

function AboutPage() {
  const { lang } = Route.useSearch();
  const t = copy[lang];
  const ap = t.aboutPage;
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <div className="site">
    <SiteHeader lang={lang} />
    <main>
      <section className="section-wrap services-page-intro">
        <p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{ap.eyebrow}</p>
        <h1>{ap.title}</h1>
        <p className="services-page-lead">{ap.intro}</p>
      </section>
      <section className="section-wrap owners-section">
        <div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{ap.ownersEyebrow}</p><h2>{ap.ownersTitle}</h2></div><span className="section-number">01 /</span></div>
        <div className="owners-grid">{ap.owners.map((owner, i) => {
          const photo = OWNER_PHOTOS[i];
          return <article key={i} className="owner">
            <div className="owner-photo">{photo ? <img src={photo} width="800" height="1000" loading="lazy" alt={`${ap.photoOf} ${owner.name}`} /> : <div className="service-row-placeholder" role="img" aria-label={t.placeholderAlt}><NordicStar className="service-row-placeholder-star" /></div>}</div>
            <h3>{owner.name}</h3>
            <p className="owner-role">{owner.role}</p>
            <p className="owner-bio">{owner.bio}</p>
          </article>;
        })}</div>
      </section>
      <section className="services-section about-details"><div className="section-wrap about-details-grid">
        <div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{ap.equipmentEyebrow}</p><h2>{ap.equipmentTitle}</h2><p>{ap.equipmentText}</p></div>
        <div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{ap.approachEyebrow}</p><h2>{ap.approachTitle}</h2><p>{ap.approachText}</p></div>
      </div></section>
      <ServiceArea lang={lang} />
      <FinalBooking lang={lang} />
    </main>
    <SiteFooter lang={lang} />
    <MobileBooking lang={lang} />
  </div>;
}
