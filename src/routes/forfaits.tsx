import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NordicStar } from '@/components/nordik/brand';
import { BookingButton, SiteHeader, SiteFooter, FinalBooking, MobileBooking } from '@/components/nordik/site-ui';
import { PACKAGE_PRICES, copy, type Language, type ProjectCategory } from '@/data/site';

export const Route = createFileRoute('/forfaits')({
  validateSearch: (search: Record<string, unknown>): { lang: Language } => ({ lang: search['lang'] === 'en' ? 'en' : 'fr' }),
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) => {
    const en = loaderData?.lang === 'en';
    const title = en ? 'Video packages on Montreal’s North Shore — NORDIK MÉDIA' : 'Forfaits vidéo sur la Rive-Nord de Montréal — NORDIK MÉDIA';
    const description = en ? 'Real estate, business, builder, event and social media video packages, plus a monthly content subscription for SMEs on Montreal’s North Shore.' : 'Forfaits vidéo immobilier, entreprise, construction, événement et réseaux sociaux, et abonnement mensuel de contenu pour les PME de la Rive-Nord de Montréal.';
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:locale', content: en ? 'en_CA' : 'fr_CA' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  component: PackagesPage,
});

// "À partir de 850 $" in French, "Starting at $850" in English.
function priceLabel(lang: Language, price: string, monthly = false) {
  const pp = copy[lang].packagesPage;
  const amount = lang === 'fr' ? `${pp.from} ${price}${pp.currencyAfter}` : `${pp.from}${price}`;
  return monthly ? `${amount}${pp.perMonth}` : amount;
}

function PackagesPage() {
  const { lang } = Route.useSearch();
  const t = copy[lang];
  const pp = t.packagesPage;
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <div className="site">
    <SiteHeader lang={lang} />
    <main>
      <section className="section-wrap services-page-intro">
        <p className="eyebrow section-eyebrow"><NordicStar className="size-3" />{pp.eyebrow}</p>
        <h1>{pp.title}</h1>
        <p className="services-page-lead">{pp.intro}</p>
      </section>
      <section className="section-wrap packages-section">
        <article className="package package-featured">
          <div className="package-featured-head">
            <span className="package-badge"><NordicStar className="size-3" />{pp.featuredBadge}</span>
            <h2>{pp.subscription.title}</h2>
            <p className="package-text">{pp.subscription.text}</p>
            <p className="package-price">{priceLabel(lang, PACKAGE_PRICES.subscription, true)}</p>
          </div>
          <div>
            <p className="package-included">{pp.included}</p>
            <ul className="package-items">{pp.subscription.items.map(item => <li key={item}><NordicStar className="package-item-star" />{item}</li>)}</ul>
            <BookingButton lang={lang} label={t.finalCta} />
          </div>
        </article>
        <div className="packages-grid">
          {pp.packages.map(pkg => <article key={pkg.id} className="package">
            <h2>{pkg.title}</h2>
            <p className="package-price">{priceLabel(lang, PACKAGE_PRICES[pkg.id as ProjectCategory])}</p>
            <p className="package-included">{pp.included}</p>
            <ul className="package-items">{pkg.items.map(item => <li key={item}><NordicStar className="package-item-star" />{item}</li>)}</ul>
            <BookingButton lang={lang} label={t.finalCta} className="package-button" />
          </article>)}
        </div>
        <p className="packages-payment">{pp.payment}</p>
      </section>
      <FinalBooking lang={lang} />
    </main>
    <SiteFooter lang={lang} />
    <MobileBooking lang={lang} />
  </div>;
}
