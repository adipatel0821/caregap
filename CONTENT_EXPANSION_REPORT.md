# Content Expansion Report

## Fully Implemented

| Item | Description | Location |
|------|-------------|----------|
| 1 | "See a real analysis" worked example | Homepage, below hero |
| 2 | Trust & security section (4 cards) | Homepage, below sample |
| 3 | Problem stats band (4 verified stats) | Homepage |
| 4 | FAQ accordion (10 Q&As) | Homepage, near bottom |
| 5 | "Who this is for" section | Homepage |
| 6 | "Laws most patients don't know exist" (6 cards) | Homepage |
| 8 | Team section (3 members, gradient avatars) | /about |
| 9 | Blog with 2 full articles | /learn, /learn/[slug] |
| 10 | Full footer (4 columns, social links) | Site-wide |
| 12 | Contact page with form + info cards | /contact |

## Stubs / Placeholders

| Page | Status |
|------|--------|
| /privacy | 300-word placeholder policy |
| /terms | 300-word placeholder terms |
| /press | "Coming soon" stub |

## TODO(user) Placeholders

| Item | What to fill in | File |
|------|-----------------|------|
| 7 - Founder story | Replace placeholder with real story from Saket/Jeel/Aditya | web/app/about/page.tsx |
| 8 - Team photos | Replace gradient-initial avatars with real photos | web/app/about/page.tsx |
| 8 - Team links | Add LinkedIn/GitHub links when ready | web/app/about/page.tsx |
| 11 - Testimonials | Collect 2-3 real quotes, then uncomment section in page.tsx | web/app/page.tsx |
| 12 - Contact email | Confirm which email receives form submissions | web/app/contact/page.tsx |
| 12 - Social channels | Confirm which LinkedIn/Instagram accounts exist | web/app/contact/page.tsx |
| 10 - Footer socials | Verify LinkedIn and Instagram URLs are real | web/components/footer.tsx |
| Privacy/Terms | Replace stubs with real policies before production | web/app/privacy, web/app/terms |

## Factual Claims to Double-Check

1. **"80% of medical bills contain errors"** - Source: Medical Billing Advocates of America. Widely cited but original source is an industry estimate, not a peer-reviewed study. Acceptable for marketing but flag if challenged.
2. **"$220B+ in medical debt"** - Source: KFF analysis of 2020 SIPP data. Solid source but the figure is from 2020 data. May have changed.
3. **"~$1,300 average overcharge"** - Source: Industry analyses 2024-2025. This is an aggregate estimate, not from a single definitive study.
4. **"~100M Americans have healthcare debt"** - Source: KFF Health News "Diagnosis: Debt" investigation. Well-sourced.
5. **501(r) charity care income thresholds** - FPL numbers are approximate and vary by hospital. The 200%/400% thresholds are common but not universal.

## Pre-Production Checklist

- [ ] Replace founder story placeholder with real story
- [ ] Replace privacy/terms stubs with real policies
- [ ] Confirm all email addresses in contact page are monitored
- [ ] Verify social media links point to real accounts (or remove)
- [ ] Test contact form mailto fallback on mobile browsers
