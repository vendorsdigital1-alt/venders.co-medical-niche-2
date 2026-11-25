# VENDERS.CO Medical — healthcare website concepts

A responsive static website for VENDERS.CO Medical, with an agency homepage and six specialty-specific practice concepts. There is no build step or package dependency.

## Run locally

Open `index.html` in a browser, or serve this folder with a static file server (for example, the VS Code Live Server extension). The specialty pages are linked from the landing page.

## Pages

- `index.html` — VENDERS.CO agency story, specialty concepts, portfolio, process, and enquiry form
- `demonstrations/dental.html`
- `demonstrations/general-practice.html`
- `demonstrations/dermatology.html`
- `demonstrations/physiotherapy.html`
- `demonstrations/psychology.html`
- `demonstrations/optometry.html`
- `404.html` — custom not-found page; configure your host to serve it for 404 responses

## Practice-demo setup

The specialty pages are deliberately marked `noindex` and are not publish-ready. Before adapting any page into a real practice site:

- Replace every bracketed placeholder in the page, footer, FAQ, and structured data with verified information.
- Replace the demo practice name, location, imagery, service information, and sample brand copy as appropriate.
- Configure `data-phone`, `data-whatsapp`, `data-directions`, and `data-opening-hours` on the page’s `<body>`. Opening-hours data is a JSON object keyed by lowercase weekday abbreviations (`mon` through `sun`) with arrays of `["HH:MM","HH:MM"]` intervals in South African time. Use an empty array for a confirmed closed day.
- Add the verified street address, suburb, city, postal code, HPCSA details where applicable, medical-aid/payment policy, parking information, and authorised patient feedback.
- Replace the canonical URL, social metadata, `sitemap.xml`, and `robots.txt` domain placeholder. Confirm the selected schema.org business type and replace the JSON-LD placeholders with real data before removing `noindex`.
- Connect a secure enquiry backend if the form should transmit information. The studio enquiry form is intentionally a local-only demo. A practice booking form opens WhatsApp only after a real WhatsApp number is configured; it does not store form values on this site.
- Add a POPIA-compliant privacy notice tailored to the practice and its actual data handling. WhatsApp is an external service subject to its own terms.
- Configure your hosting provider to serve `404.html` as the not-found document. `file:` preview does not exercise server 404 behavior.

Missing or unverified practice information stays visibly marked rather than being inferred. Demo pages are intentionally excluded from search indexing; do not expose the placeholder schema or the sample sitemap to crawlers as production practice content.

## Assets and behavior

- `assets/css/` contains shared design tokens, specialty components, responsive rules, and print styles.
- `assets/js/` contains the medical image map, mobile navigation, specialty filters, local-only enquiry behavior, WhatsApp appointment behavior, and practice contact/hours configuration.
- `assets/fonts/` contains locally hosted DM Sans and Manrope variable fonts with their SIL Open Font License text.
- `assets/images/medical/` contains specialty-specific healthcare photos in WebP with JPEG fallbacks, the VENDERS.CO Midways Dental concept artwork, the source collage, and retained SVG illustrations. Modern browsers use WebP when available.
- `assets/images/backgrounds/` contains the six supplied compressed JPEG textures. The agency homepage uses them selectively across the hero, editorial, portfolio, contact, and footer sections; specialty pages use lighter ivory/pearl surfaces and a more distinctive navy, champagne, teal, silk, and charcoal treatment for the Midways Dental concept. Readability overlays and dark-mode variants are defined in the CSS.
- `demonstrations/dental.html` presents the supplied Midways Dental brand direction and proposed family-focused dental service categories. Verify all clinical claims, team details, and offered services with the practice before publication; only the practice name and creative direction were supplied.
- Forms perform client-side validation. The practice booking form prepares a WhatsApp request when configured; the studio enquiry form does not transmit or store submissions.
- The agency specialty preview and practice service explorers are keyboard-operable tabs. Specialty FAQs use native disclosure controls, and reduced-motion preferences are respected.

The sitemap and canonical paths require a real deployment domain. The local pages do not embed a third-party map or analytics/tracking scripts. JPEG source photos are retained as fallbacks; WebP variants are used where supported. The supplied Midways Dental concept artwork is served as a compressed JPEG.
