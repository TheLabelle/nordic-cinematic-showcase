import { describe, expect, it } from 'vitest';
import { BOOKING_URL, filterProjects, projects } from '@/data/site';
describe('Nordik project and booking configuration', () => {
  it('keeps the booking destination as the requested single placeholder', () => { expect(BOOKING_URL).toBe('BOOKING_URL'); });
  it('provides exactly six editable placeholder projects', () => { expect(projects).toHaveLength(6); });
  it('filters real estate without showing events', () => { expect(filterProjects('real-estate').map(p => p.id)).toEqual([1,3,4,6]); });
  it('filters events without showing real estate', () => { expect(filterProjects('events').map(p => p.id)).toEqual([2,5]); });
  it('shows all six projects for all', () => { expect(filterProjects('all')).toHaveLength(6); });
});
