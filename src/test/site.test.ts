import { describe, expect, it } from 'vitest';
import { BOOKING_URL, copy, findProject, featuredProjects, filterProjects, projects } from '@/data/site';
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
  it('gives the two project links different labels in both languages', () => {
    expect(copy.fr.projects).not.toBe(copy.fr.portfolio);
    expect(copy.en.projects).not.toBe(copy.en.portfolio);
  });
});
