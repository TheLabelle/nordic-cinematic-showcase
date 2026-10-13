import { createServerFn } from '@tanstack/react-start';

// Single constant for recipient email address.
// Stored here on the server and never exposed to the client.
export const QUOTE_RECIPIENT_EMAIL = 'benjaminparadis22@icloud.com';

export interface QuoteSubmissionPayload {
  name: string;
  phone?: string | undefined;
  email?: string | undefined;
  projectTypes: ('real-estate' | 'events')[];
  message?: string | undefined;
  hp_website?: string | undefined;
}

export interface QuoteSubmissionResponse {
  success: boolean;
  error?: string;
}

function getResendApiKey(): string | undefined {
  if (typeof process !== 'undefined' && process.env?.['RESEND_API_KEY']) {
    return process.env['RESEND_API_KEY'];
  }
  return undefined;
}

export async function processQuoteSubmission(
  data: QuoteSubmissionPayload,
): Promise<QuoteSubmissionResponse> {
  // 1. Honeypot check for spam protection
  if (data.hp_website && data.hp_website.trim().length > 0) {
    // Silently accept to trap bots
    return { success: true };
  }

  // 2. Validate name
  if (!data.name || data.name.trim().length === 0) {
    return { success: false, error: 'Name is required' };
  }

  // 3. Validate contact info: at least one of phone or email
  const hasPhone = Boolean(data.phone && data.phone.trim().length > 0);
  const hasEmail = Boolean(data.email && data.email.trim().length > 0);
  if (!hasPhone && !hasEmail) {
    return { success: false, error: 'At least one of phone or email is required' };
  }

  if (hasEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email!.trim())) {
      return { success: false, error: 'Invalid email format' };
    }
  }

  if (hasPhone) {
    const cleanPhone = data.phone!.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 7) {
      return { success: false, error: 'Invalid phone format' };
    }
  }

  // 4. Validate project types: at least one selected
  if (!data.projectTypes || data.projectTypes.length === 0) {
    return { success: false, error: 'At least one project type is required' };
  }

  const projectLabels = data.projectTypes
    .map(t => (t === 'real-estate' ? 'Immobilier / Real estate' : 'Événement / Event'))
    .join(', ');

  const plainText = `
Nouvelle demande de soumission — NORDIK MÉDIA
==============================================

Nom: ${data.name.trim()}
Téléphone: ${data.phone?.trim() || 'Non spécifié'}
Courriel: ${data.email?.trim() || 'Non spécifié'}
Type(s) de projet: ${projectLabels}

Message:
${data.message?.trim() || '(Aucun message)'}

Date: ${new Date().toLocaleString('fr-CA', { timeZone: 'America/Toronto' })}
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background-color: #0F1E3D; color: #FFFFFF; padding: 24px;">
  <div style="max-width: 600px; margin: auto; background-color: #1A2A4D; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 32px;">
    <h2 style="margin-top: 0; color: #FFFFFF; font-family: serif; font-size: 24px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 16px;">
      Nouvelle demande de soumission
    </h2>
    <p style="margin: 12px 0;"><strong>Nom :</strong> ${escapeHtml(data.name.trim())}</p>
    <p style="margin: 12px 0;"><strong>Téléphone :</strong> ${escapeHtml(data.phone?.trim() || 'Non spécifié')}</p>
    <p style="margin: 12px 0;"><strong>Courriel :</strong> ${escapeHtml(data.email?.trim() || 'Non spécifié')}</p>
    <p style="margin: 12px 0;"><strong>Type(s) de projet :</strong> ${escapeHtml(projectLabels)}</p>
    <div style="margin: 20px 0; padding: 16px; background-color: rgba(255,255,255,0.05); border-radius: 4px;">
      <strong>Message :</strong>
      <p style="margin: 8px 0 0; white-space: pre-wrap;">${escapeHtml(data.message?.trim() || 'Aucun message')}</p>
    </div>
    <p style="font-size: 12px; opacity: 0.6; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
      Envoyé depuis le formulaire de soumission NORDIK MÉDIA le ${new Date().toLocaleString('fr-CA', { timeZone: 'America/Toronto' })}
    </p>
  </div>
</body>
</html>
`.trim();

  const apiKey = getResendApiKey();

  if (apiKey) {
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'NORDIK MÉDIA <onboarding@resend.dev>',
          to: [QUOTE_RECIPIENT_EMAIL],
          reply_to: data.email?.trim() || undefined,
          subject: `Nouvelle demande de soumission — ${data.name.trim()}`,
          text: plainText,
          html: htmlContent,
        }),
      });

      if (!resendResponse.ok) {
        const errText = await resendResponse.text();
        console.error('[Resend Error]', resendResponse.status, errText);
        return { success: false, error: 'Email service error' };
      }

      return { success: true };
    } catch (err) {
      console.error('[Resend Fetch Error]', err);
      return { success: false, error: 'Network error sending email' };
    }
  }

  // Fallback when RESEND_API_KEY is not yet configured
  console.log('\n==================================================');
  console.log('[NORDIK MÉDIA] NOUVELLE DEMANDE DE SOUMISSION (Simulée)');
  console.log('Destinataire:', QUOTE_RECIPIENT_EMAIL);
  console.log(plainText);
  console.log('NOTE: Configurez RESEND_API_KEY pour l\'envoi réel.');
  console.log('==================================================\n');

  return { success: true };
}

export const submitQuoteRequest = createServerFn({ method: 'POST' })
  .validator((data: QuoteSubmissionPayload) => data)
  .handler(async ({ data }): Promise<QuoteSubmissionResponse> => {
    return processQuoteSubmission(data);
  });

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
