import { describe, expect, it } from 'vitest';
import { copy, CONTACT_EMAIL } from '@/data/site';
import { QUOTE_RECIPIENT_EMAIL, processQuoteSubmission } from '@/lib/quote';

describe('Quote request configuration and backend handler', () => {
  it('defines the public contact email', () => {
    expect(CONTACT_EMAIL).toBe('contact@nordikmedia.ca');
  });

  it('stores the confidential recipient address in a single constant', () => {
    expect(QUOTE_RECIPIENT_EMAIL).toBe('benjaminparadis22@icloud.com');
  });

  it('provides bilingual quotePage copy with required elements', () => {
    expect(copy.fr.quotePage.title).toBe('Demandez votre soumission');
    expect(copy.en.quotePage.title).toBe('Request your quote');
    expect(copy.fr.quotePage.eyebrow).toBe('SOUMISSION GRATUITE');
    expect(copy.en.quotePage.eyebrow).toBe('FREE QUOTE');
    expect(copy.fr.quotePage.submit).toBe('Envoyer ma demande');
    expect(copy.en.quotePage.submit).toBe('Send my request');
  });

  it('rejects submissions with missing name', async () => {
    const res = await processQuoteSubmission({
      name: '',
      email: 'test@example.com',
      projectTypes: ['real-estate'],
    });
    expect(res.success).toBe(false);
    expect(res.error).toBe('Name is required');
  });

  it('rejects submissions when both email and phone are empty', async () => {
    const res = await processQuoteSubmission({
      name: 'Jean Tremblay',
      projectTypes: ['real-estate'],
    });
    expect(res.success).toBe(false);
    expect(res.error).toBe('At least one of phone or email is required');
  });

  it('rejects submissions with invalid email', async () => {
    const res = await processQuoteSubmission({
      name: 'Jean Tremblay',
      email: 'invalid-email',
      projectTypes: ['real-estate'],
    });
    expect(res.success).toBe(false);
    expect(res.error).toBe('Invalid email format');
  });

  it('rejects submissions with invalid phone number', async () => {
    const res = await processQuoteSubmission({
      name: 'Jean Tremblay',
      phone: '123',
      projectTypes: ['real-estate'],
    });
    expect(res.success).toBe(false);
    expect(res.error).toBe('Invalid phone format');
  });

  it('rejects submissions with no project type selected', async () => {
    const res = await processQuoteSubmission({
      name: 'Jean Tremblay',
      email: 'jean@example.com',
      projectTypes: [],
    });
    expect(res.success).toBe(false);
    expect(res.error).toBe('At least one project type is required');
  });

  it('silently traps bot spam when honeypot field is filled', async () => {
    const res = await processQuoteSubmission({
      name: 'Spam Bot',
      email: 'bot@spam.com',
      projectTypes: ['real-estate'],
      hp_website: 'http://spam.com',
    });
    expect(res.success).toBe(true);
  });

  it('accepts valid submission with email or phone', async () => {
    const res = await processQuoteSubmission({
      name: 'Jean Tremblay',
      email: 'jean@example.com',
      phone: '514-555-1234',
      projectTypes: ['real-estate', 'events'],
      message: 'Court métrage pour une propriété à Laval.',
    });
    expect(res.success).toBe(true);
  });
});
