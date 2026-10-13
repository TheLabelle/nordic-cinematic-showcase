import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { Mail, MapPin, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { NordicStar } from '@/components/nordik/brand';
import { SiteHeader, SiteFooter } from '@/components/nordik/site-ui';
import { copy, CONTACT_EMAIL, QUOTE_PROJECT_TYPES, type Language, type QuoteProjectType } from '@/data/site';
import { submitQuoteRequest } from '@/lib/quote';

export const Route = createFileRoute('/soumission')({
  validateSearch: (search: Record<string, unknown>): { lang: Language } => ({
    lang: search['lang'] === 'en' ? 'en' : 'fr',
  }),
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) => {
    const en = loaderData?.lang === 'en';
    const title = en ? 'Free video quote on Montreal’s North Shore — NORDIK MÉDIA' : 'Soumission vidéo gratuite sur la Rive-Nord de Montréal — NORDIK MÉDIA';
    const description = en
      ? 'Tell us about your real estate, business, construction, event or social media video project on Montreal’s North Shore and receive a fast, free quote.'
      : 'Décrivez votre projet vidéo immobilier, d’entreprise, de construction, d’événement ou pour les réseaux sociaux sur la Rive-Nord de Montréal et recevez une soumission gratuite rapidement.';
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: en ? 'en_CA' : 'fr_CA' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    };
  },
  component: QuotePage,
});

function QuotePage() {
  const { lang } = Route.useSearch();
  const t = copy[lang];
  const qp = t.quotePage;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<QuoteProjectType[]>([]);
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [hpWebsite, setHpWebsite] = useState(''); // Honeypot field

  // Feedback state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation error states
  const [contactError, setContactError] = useState<string | null>(null);
  const [projectTypeError, setProjectTypeError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setContactError(null);
    setProjectTypeError(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    // 1. Validate Name
    if (!trimmedName) {
      setErrorMessage(qp.errorName);
      return;
    }

    // 2. Validate at least one of phone or email is present
    if (!trimmedPhone && !trimmedEmail) {
      setContactError(qp.errorContact);
      setErrorMessage(qp.errorContact);
      return;
    }

    // 3. Format validation
    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setContactError(qp.errorEmailFormat);
        setErrorMessage(qp.errorEmailFormat);
        return;
      }
    }

    if (trimmedPhone) {
      const digitsOnly = trimmedPhone.replace(/\D/g, '');
      if (digitsOnly.length < 7) {
        setContactError(qp.errorPhoneFormat);
        setErrorMessage(qp.errorPhoneFormat);
        return;
      }
    }

    // 4. Validate project type
    // Keep the on-screen order regardless of click order
    const projectTypes = QUOTE_PROJECT_TYPES.filter((type) => selectedTypes.includes(type));

    if (projectTypes.length === 0) {
      setProjectTypeError(qp.errorProjectType);
      setErrorMessage(qp.errorProjectType);
      return;
    }

    // Submit payload
    setIsSubmitting(true);
    try {
      const response = await submitQuoteRequest({
        data: {
          name: trimmedName,
          phone: trimmedPhone || undefined,
          email: trimmedEmail || undefined,
          projectTypes,
          preferredDate: preferredDate || undefined,
          message: message.trim() || undefined,
          hp_website: hpWebsite || undefined,
        },
      });

      if (response && response.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(response?.error || qp.errorGeneric);
      }
    } catch (err) {
      console.error('Quote submission error:', err);
      setErrorMessage(qp.errorGeneric);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site">
      <SiteHeader lang={lang} />
      <main>
        <section className="section-wrap quote-page-section">
          <div className="quote-layout">
            {/* Left column: Text, Heading, Info cards */}
            <div className="quote-info">
              <p className="eyebrow section-eyebrow">
                <NordicStar className="size-3" />
                {qp.eyebrow}
              </p>
              <h1 className="quote-heading">{qp.title}</h1>
              <p className="quote-subtext">{qp.subtitle}</p>

              <div className="quote-cards">
                <div className="quote-card">
                  <div className="quote-card-icon">
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <div className="quote-card-content">
                    <span className="quote-card-label">{qp.emailLabel}</span>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="quote-card-value">
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="quote-card">
                  <div className="quote-card-icon">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <div className="quote-card-content">
                    <span className="quote-card-value">{qp.areaLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Quote request form */}
            <div className="quote-form-card">
              {isSuccess ? (
                <div className="quote-success-state">
                  <NordicStar className="success-star" />
                  <h2 className="success-title">{qp.success}</h2>
                  <p className="success-sub">{qp.successSub}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setIsSuccess(false);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setSelectedTypes([]);
                      setPreferredDate('');
                      setMessage('');
                    }}
                  >
                    {qp.sendAnother}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {errorMessage && (
                    <div className="form-error-banner" role="alert">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Honeypot field for bot protection */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="company_website_hp">Website</label>
                    <input
                      id="company_website_hp"
                      type="text"
                      name="hp_website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={hpWebsite}
                      onChange={(e) => setHpWebsite(e.target.value)}
                    />
                  </div>

                  {/* Name (required) */}
                  <div className="form-group">
                    <label htmlFor="quote-name" className="form-label">
                      <span>{qp.name} *</span>
                    </label>
                    <input
                      id="quote-name"
                      type="text"
                      required
                      className="form-input"
                      placeholder={qp.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Phone number */}
                  <div className="form-group">
                    <label htmlFor="quote-phone" className="form-label">
                      <span>{qp.phone}</span>
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      className="form-input"
                      placeholder={qp.phonePlaceholder}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (contactError) setContactError(null);
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="quote-email" className="form-label">
                      <span>{qp.email}</span>
                    </label>
                    <input
                      id="quote-email"
                      type="email"
                      className="form-input"
                      placeholder={qp.emailPlaceholder}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (contactError) setContactError(null);
                      }}
                    />
                    {contactError && <span className="field-error">{contactError}</span>}
                  </div>

                  {/* Project type (required, checkboxes) */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>{qp.projectType} *</span>
                    </label>
                    <div className="checkbox-group">
                      {QUOTE_PROJECT_TYPES.map((type) => (
                        <label key={type} className="checkbox-label" htmlFor={`type-${type}`}>
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              setSelectedTypes((prev) =>
                                checked ? [...prev, type] : prev.filter((t) => t !== type),
                              );
                              if (projectTypeError) setProjectTypeError(null);
                            }}
                          />
                          <span>{qp.projectTypes[type]}</span>
                        </label>
                      ))}
                    </div>
                    {projectTypeError && <span className="field-error">{projectTypeError}</span>}
                  </div>

                  {/* Preferred date (optional), centered in the form card */}
                  <div className="form-group form-group-centered">
                    <label htmlFor="quote-date" className="form-label">
                      <span>{qp.date} <span className="form-optional">({qp.optional})</span></span>
                    </label>
                    <input
                      id="quote-date"
                      type="date"
                      className="form-input form-date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </div>

                  {/* Message (optional) */}
                  <div className="form-group">
                    <label htmlFor="quote-message" className="form-label">
                      <span>{qp.message}</span>
                    </label>
                    <textarea
                      id="quote-message"
                      rows={4}
                      className="form-textarea"
                      placeholder={qp.messagePlaceholder}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="quote-submit-button"
                  >
                    <span>{isSubmitting ? qp.submitting : qp.submit}</span>
                    <ArrowUpRight size={17} />
                  </Button>

                  {/* Confidentiality note */}
                  <p className="quote-confidential-note">{qp.confidential}</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
      {/* Sticky mobile booking button is explicitly omitted on this page */}
    </div>
  );
}
