import { describe, expect, it } from 'vitest';
import { BOOKING_URL, featuredProjects, filterProjects, projects } from '@/data/site';
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
  it('shows all twelve projects for all', () => { expect(filterProjects('all')).toHaveLength(12); });
});
