import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NordicStar } from '@/components/nordik/brand';
import { BookingButton, SiteHeader, SiteFooter, FinalBooking, MobileBooking, ExpertiseList, ServiceArea } from '@/components/nordik/site-ui';
import { SERVICE_MEDIA, copy, imageAlt, type Language, type ProjectCategory } from '@/data/site';

export const Route = createFileRoute('/services')({
  validateSearch: (search: Record<string, unknown>): { lang: Language } => ({ lang: search['lang'] === 'en' ? 'en' : 'fr' }),
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) => {
    const en = loaderData?.lang === 'en';
    const title = en ? 'Video services on Montreal’s North Shore — NORDIK MÉDIA' : 'Services vidéo sur la Rive-Nord de Montréal — NORDIK MÉDIA';
    const description = en ? 'Real estate, business, builder, event and social media video on Montreal’s North Shore: filming, drone and editing. Laval, Terrebonne, Blainville, Mirabel and Saint-Jérôme.' : 'Vidéo immobilière, d’entreprise, de construction, d’événement et pour les réseaux sociaux sur la Rive-Nord de Montréal : tournage, drone et montage. Laval, Terrebonne, Blainville, Mirabel et Saint-Jérôme.';
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:locale', content: en ? 'en_CA' : 'fr_CA' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  component: ServicesPage,
});

function ServicesPage() {
  const { lang } = Route.useSearch();
  const t = copy[lang];
  const sp = t.servicesPage;
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <div className="site">
    <SiteHeader lang={lang} />
    <main>
      <section className="section-wrap services-page-intro">
        <p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{sp.eyebrow}</p>
        <h1>{sp.title}</h1>
        <p className="services-page-lead">{sp.intro}</p>
      </section>
      {sp.services.map((service, i) => {
        const media = SERVICE_MEDIA[service.id as ProjectCategory];
        return <section key={service.id} id={service.id} className="section-wrap service-row">
          <div className="service-row-media">
            {media.videoUrl ? <iframe src={media.videoUrl} title={service.title} loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              : media.image ? <img src={media.image} width="1280" height="832" loading="lazy" alt={imageAlt(media.image, lang, service.title)} />
              : <div className="service-row-placeholder"><NordicStar className="service-row-placeholder-star" /><span>{sp.mediaPlaceholder}</span></div>}
          </div>
          <div className="service-row-text">
            <span className="section-number">{String(i + 1).padStart(2, '0')} /</span>
            <h2>{service.title}</h2>
            <p>{service.text}</p>
            <BookingButton lang={lang} label={t.finalCta} />
          </div>
        </section>;
      })}
      <section className="services-section services-options"><div className="section-wrap"><div className="section-heading"><div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{sp.optionsEyebrow}</p><h2>{sp.optionsTitle}</h2></div></div><ExpertiseList lang={lang} /></div></section>
      <section className="section-wrap about-details"><div className="about-details-grid">
        <div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{sp.equipmentEyebrow}</p><h2>{sp.equipmentTitle}</h2><p>{sp.equipmentText}</p></div>
        <div><p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{sp.approachEyebrow}</p><h2>{sp.approachTitle}</h2><p>{sp.approachText}</p></div>
      </div></section>
      <ServiceArea lang={lang} />
      <FinalBooking lang={lang} />
    </main>
    <SiteFooter lang={lang} />
    <MobileBooking lang={lang} />
  </div>;
}
