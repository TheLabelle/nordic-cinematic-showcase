# Nordic Cinematic Showcase

Build a one-page, mobile-first website for NORDIK MÉDIA, a video production company based in Greater Montreal (Quebec), with the cinematic hero, Nordic star branding, and FR/EN foundation.

GOAL
A modern, high-conversion site. Visitors are ready to act. The single conversion goal is to get them to book a free quote online. The booking button must always be one click away.

AUDIENCE
1. Real estate agents who want a promotional video for a new listing.
2. Companies that want their corporate event filmed.

LANGUAGE
Bilingual French / English with an FR | EN toggle in the header. French is the default. Use Quebec French. All text, buttons and labels must exist in both languages.

BRAND AND STYLE
- Colors: deep navy blue background (#0F1E3D), a slightly lighter navy for cards and accents (#1A2A4D), white text. No black and gold.
- Logo: the words "NORDIK MÉDIA" in a white serif typeface with wide letter spacing, centered over a subtle four-pointed nordic star. Use the star as a discreet recurring motif.
- Typography: elegant serif for headings, clean sans-serif for body text.
- Feel: premium, cinematic, minimal, lots of spacing, subtle animations only.

BOOKING BUTTON
- Label: "Soumission gratuite" (FR) / "Free quote" (EN).
- Every booking button opens the same external booking link. Use the placeholder "BOOKING_URL" stored in one single constant so I can replace it later.
- Sticky header with the booking button on desktop.
- Sticky booking button fixed at the bottom of the screen on mobile.

PAGE STRUCTURE

1. Hero
- Full-screen section with a background video placeholder (muted, looping) and a dark navy overlay.
- Short headline, one line of subtext, one booking button.
- Headline FR: "Des vidéos qui font vendre." / EN: "Video that sells."
- Subtext FR: "Vidéo immobilière et événementielle. Rive-Sud et Rive-Nord." / EN: "Real estate and event video. South Shore and North Shore."

2. Projects
- Filter buttons above the grid: "Tous / Immobilier / Événements" (All / Real Estate / Events).
- Responsive grid of project cards. Each card has: a video thumbnail with a play icon, a small location tag (example: "LAVAL, QC"), a short title, a one-line description.
- Clicking a card opens the video in a lightbox (YouTube or Vimeo embed).
- Fill with 6 placeholder projects stored in one easy-to-edit data file (title, location, category, thumbnail, video URL), so I can replace them later.

3. Services
- Simple cards with an icon, a title and one line of text each.
- Services: "Vidéo par drone" / "Drone video" and "Vidéo cinématique" / "Cinematic video".
- Build the layout so I can easily add more services later.

4. Social proof
- 3 short testimonial cards, 1 to 2 lines each, with name and role (example: real estate broker, event manager).
- Use clearly marked placeholder text ("Témoignage à remplacer") so I can insert real client testimonials.

5. Logistics
- Compact section: "Zone desservie : Rive-Sud et Rive-Nord de Montréal" / "Service area: Montreal's South Shore and North Shore".
- Keep it short, with a simple icon or minimal map graphic.

6. Final booking section
- Large, clean, full-width section with a short headline and one large booking button.
- Headline FR: "Réservez votre soumission gratuite." / EN: "Book your free quote."

7. Footer
- Logo, service area, social media icon placeholders, language toggle. Minimal.

EXCLUSIONS (do not include)
- No pricing or pricing breakdowns
- No long explanations or long paragraphs
- No lead forms or contact forms
- No blog
- No email capture or newsletter
- No emotional or motivational copy

TECHNICAL REQUIREMENTS
- Mobile-first, fully responsive
- Fast loading: lazy-load images and videos, compressed assets, no heavy libraries
- Smooth scroll navigation between sections
- Basic SEO meta tags in both languages

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ec55d154-8ad2-45f0-a55c-bd868e638a9c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
