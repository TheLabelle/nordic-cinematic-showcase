import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BOOKING_URL, CATEGORY_ORDER, PACKAGE_PRICES, SERVICE_CITIES, SERVICE_MEDIA, copy, findProject, featuredProjects, filterProjects, projects, testimonials } from '@/data/site';
describe('Nordik project and booking configuration', () => {
  it('keeps the booking destination as the requested single placeholder', () => { expect(BOOKING_URL).toBe('BOOKING_URL'); });
  it('provides exactly twelve editable placeholder projects', () => { expect(projects).toHaveLength(12); });
  it('marks exactly three projects as featured', () => { expect(projects.filter(p => p.featured).map(p => p.id)).toEqual([1,2,3]); });
  it('shows only the three featured projects on home', () => { expect(featuredProjects().map(p => p.id)).toEqual([1,2,3]); });
  it('limits home to three even if more projects become featured', () => {
    const project = projects[3];
    if (!project) throw new Error('Missing fourth project');
    const original = project.featured;
    try { project.featured = true; expect(featuredProjects().map(p => p.id)).toEqual([1,2,3]); }
    finally { project.featured = original; }
  });
  it('filters real estate without showing events', () => { expect(filterProjects('real-estate').map(p => p.id)).toEqual([1,3,4,6,7,9,10,12]); });
  it('filters events without showing real estate', () => { expect(filterProjects('events').map(p => p.id)).toEqual([2,5,8,11]); });
  it('gives every project a unique detail page address', () => { expect(new Set(projects.map(p => p.slug)).size).toBe(12); expect(findProject('une-autre-perspective')?.id).toBe(1); });
  it('shows all twelve projects for all', () => { expect(filterProjects('all')).toHaveLength(12); });
  it('keeps the home intro block bilingual with the approved wording', () => {
    expect(copy.fr.introTitle).toBe('Pourquoi une vidéo promotionnelle?');
    expect(copy.en.introTitle).toBe('Why a promotional video?');
    expect(copy.fr.introP1).toContain('l’espace, l’ambiance et le professionnalisme de votre entreprise');
    expect(copy.en.introP1).toContain('the space, the atmosphere and the professionalism of your business');
    expect(copy.fr.introP2).toContain('met en valeur vos propriétés et vos événements');
    expect(copy.en.introP2).toContain('showcases your properties and events');
  });
  it('labels the menu Services · Réalisations · Forfaits · Soumission', () => {
    expect([copy.fr.services, copy.fr.projects, copy.fr.packagesNav, copy.fr.quoteNav]).toEqual(['Services', 'Réalisations', 'Forfaits', 'Soumission']);
    expect([copy.en.services, copy.en.projects, copy.en.packagesNav, copy.en.quoteNav]).toEqual(['Services', 'Our work', 'Packages', 'Quote']);
  });
  it('keeps every package price as a [PRIX] placeholder and mentions Interac', () => {
    expect(Object.values(PACKAGE_PRICES)).toEqual(Array(6).fill('[PRIX]'));
    expect(copy.fr.packagesPage.packages.map(p => p.id)).toEqual(['real-estate', 'business', 'construction', 'events', 'vlog']);
    expect(copy.en.packagesPage.packages).toHaveLength(5);
    for (const lang of ['fr', 'en'] as const) for (const p of copy[lang].packagesPage.packages) expect(p.items.length).toBeGreaterThanOrEqual(3);
    expect(copy.fr.packagesPage.payment).toBe('Paiement par virement Interac.');
  });
  it('shows equipment and approach on the services page in both languages', () => {
    expect(copy.fr.servicesPage.equipmentTitle).toBe('Notre équipement');
    expect(copy.fr.servicesPage.approachTitle).toBe('Notre approche');
    expect(copy.en.servicesPage.equipmentTitle).toBe('Our equipment');
    expect(copy.en.servicesPage.approachTitle).toBe('Our approach');
  });
  it('has a summary paragraph for every portfolio category in both languages', () => {
    for (const lang of ['fr', 'en'] as const) for (const c of CATEGORY_ORDER.filter(c => c !== 'all')) expect(copy[lang].categoryIntros[c].length).toBeGreaterThan(40);
  });
  it('never sets text smaller than 12px in the stylesheet', () => {
    const css = readFileSync(resolve(__dirname, '../styles.css'), 'utf8');
    const sizes = [...css.matchAll(/font(?:-size)?:\s*(\d+(?:\.\d+)?)px/g)].map(m => Number(m[1]));
    expect(sizes.length).toBeGreaterThan(0);
    expect(sizes.filter(n => n < 12)).toEqual([]);
  });
  it('targets Montreal’s North Shore and lists the five served cities', () => {
    expect(copy.fr.region).toBe('Rive-Nord de Montréal');
    expect(copy.en.region).toBe('Montreal’s North Shore');
    expect(SERVICE_CITIES).toEqual(['Laval', 'Terrebonne', 'Blainville', 'Mirabel', 'Saint-Jérôme']);
    for (const lang of ['fr', 'en'] as const) expect(JSON.stringify(copy[lang])).not.toMatch(/Rive-Sud|Grand Montréal|South Shore|Greater Montreal/);
  });
  it('offers six portfolio filters with an empty state for categories without projects yet', () => {
    expect(CATEGORY_ORDER).toEqual(['all', 'real-estate', 'events', 'business', 'construction', 'vlog']);
    expect(copy.fr.filters).toEqual(['Tous', 'Immobilier', 'Événements', 'Commerces', 'Construction', 'Vlogs']);
    expect(copy.en.filters).toHaveLength(6);
    expect(filterProjects('construction')).toHaveLength(0);
  });
  it('lists the five services in the same order in both languages, each with a media slot', () => {
    const ids = ['real-estate', 'business', 'construction', 'events', 'vlog'];
    expect(copy.fr.servicesPage.services.map(x => x.id)).toEqual(ids);
    expect(copy.en.servicesPage.services.map(x => x.id)).toEqual(ids);
    expect(Object.keys(SERVICE_MEDIA).sort()).toEqual([...ids].sort());
    expect(copy.fr.servicesPage.services[0]?.text).toBe('Faites ressortir chaque propriété, de l’intérieur jusqu’au quartier vu du ciel.');
  });
  it('adds the four “why choose us” points in both languages', () => {
    expect(copy.fr.whyTitle).toBe('Pourquoi nous choisir');
    expect(copy.fr.serviceTitle).toBe('Nos expertises');
    expect(copy.fr.whyItems).toHaveLength(4);
    expect(copy.en.whyItems).toHaveLength(4);
  });
  it('shows the Remorques Labelle testimonial first with the approved wording', () => {
    expect(testimonials[0]?.quote.fr).toBe('Vidéo de grande qualité, équipement professionnel et une équipe qui répond rapidement. On recommande sans hésiter.');
    expect(testimonials[0]?.quote.en).toBe('High-quality video, professional equipment and a team that responds quickly. We highly recommend them.');
    expect(testimonials[0]?.author.fr).toBe('Remorques Labelle, Laval');
    expect(testimonials[0]?.author.en).toBe('Remorques Labelle, Laval');
  });
  it('labels the first client as an event client, not a broker', () => {
    expect(testimonials[0]?.role.fr).toBe('Événementiel');
    expect(testimonials[0]?.role.en).toBe('Event');
    expect(testimonials[0]?.role.fr).not.toBe('Courtier immobilier');
  });
  it('keeps three testimonials with the two remaining ones still placeholders', () => {
    expect(testimonials).toHaveLength(3);
    expect(testimonials[1]?.quote.fr).toBe('Témoignage à remplacer');
    expect(testimonials[2]?.quote.en).toBe('Testimonial to replace');
  });
});
