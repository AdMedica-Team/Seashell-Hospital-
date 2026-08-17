# Phase 0 — Discovery, Information Architecture & Wireframes

Status: draft for stakeholder sign-off. This document gates Phase 1 (design system build) — confirm page list, nav structure, and per-template content requirements before visual design starts.

## 1. Site map

Every public URL is locale-prefixed (`/en/...`, `/ar/...`); the admin CMS is prefixed the same way (`/admin/en/...`, `/admin/ar/...`).

```
Public site
├── / (Homepage)
├── /about                          About Us & Leadership
├── /departments                    Outpatient departments index
│   └── /departments/[slug]         One page per department/service
├── /centers-of-excellence          Interactive specialties showcase (index)
│   └── /centers-of-excellence/[slug]
├── /doctors                        Doctors directory (browse/filter)
│   ├── /doctors/find               Find a Doctor — by specialty | by condition
│   └── /doctors/[slug]             Doctor profile
├── /news                           News & What's New (index/feed)
│   └── /news/[slug]
├── /testimonials                   Patient testimonials (written + video)
├── /careers                        Open positions (index)
│   └── /careers/[slug]
├── /calculators                    Health calculators (index)
│   ├── /calculators/bmi
│   ├── /calculators/bmr
│   └── /calculators/body-fat
├── /faq                            Sitewide FAQ accordion
├── /contact                        Contact & Patient Info (address, hours, map, form, WhatsApp, hotline, patient rights)
├── /callback                       Request a Callback (OTP-verified)
├── /pay                            Pay Online (no login, lookup by bill reference)
├── /anti-fraud-notice              Anti-fraud disclaimer (also linked from footer on every page)
└── /legal
    ├── /legal/privacy               Privacy Policy (PDPL 151/2020-aligned)
    └── /legal/terms                 Terms & Conditions

Admin CMS (/admin)
├── /admin/login
├── /admin/dashboard
├── /admin/doctors               (CRUD)
├── /admin/departments           (CRUD, incl. "Center of Excellence" flag + procedures)
├── /admin/conditions            (CRUD — powers "find doctor by condition")
├── /admin/news                  (CRUD)
├── /admin/testimonials          (CRUD, consent gate before publish)
├── /admin/careers               (CRUD)
├── /admin/awards                (CRUD)
├── /admin/faq                   (CRUD)
├── /admin/leadership            (CRUD)
├── /admin/pages                 (homepage hero/intro, About body, Anti-fraud text, Contact info, Quick Links/emergency numbers)
├── /admin/callback-requests     (queue: view, mark contacted/closed)
├── /admin/payments              (read-only transaction log)
├── /admin/users                 (super admin only)
└── /admin/settings              (integration credentials — super admin only)
```

## 2. Global persistent elements (present on every public page)

- **Top bar**: emergency number, "patient support available 24/7" line.
- **Header / mega-menu**: logo, primary nav (Services, Doctors, About, News, Contact, ...), language switch (EN ⇄ عربي). Each mega-menu panel keeps a **persistent Quick Links column** — emergency numbers/helplines + quick-access buttons — visible regardless of which top-level item is open. No location/branch picker anywhere (single building).
- **Sticky action bar** (bottom, every page): 4 fixed shortcuts — *Book appointment* · *Find a hospital* (single building, so this is a direct link to `/contact`'s address/map rather than a search) · *Book a checkup* · *Get a specialist opinion*.
- **Footer**: sitemap links, legal links, anti-fraud notice link, social links, hotline/WhatsApp.

## 3. Navigation structure (mega-menu)

| Top-level item | Reveals |
|---|---|
| Services | Departments index, grouped by category |
| Centers of Excellence | Interactive specialty grid |
| Doctors | Directory + Find a Doctor (by specialty / by condition) |
| About | About us, Leadership, Accreditations & Awards |
| News | News feed, Testimonials |
| Patient Info | FAQ, Contact, Careers, Request a Callback, Pay Online, Health Calculators |
| *(persistent panel, all menus)* | Emergency numbers, Book appointment, Request callback, Pay online |

## 4. Per-template content requirements

| Template | Required fields (bilingual EN/AR unless noted) |
|---|---|
| Homepage | Hero headline, hero subtext, hero image, 2 CTA buttons, unified search placeholder text, 3–4 intro blocks, featured departments/doctors, news preview, testimonial preview |
| Department page | Name, summary, full description, hero image, service/procedure list, linked doctors, "Consult [Specialty]" CTA target |
| Center of Excellence detail | Name, blurb, key procedures, image, direct booking CTA |
| Doctor profile | Name, title, department(s), bio, photo, languages spoken, featured flag |
| Find a Doctor | Specialty list, condition list + condition→specialty/doctor mapping |
| News post | Title, excerpt, body, cover image, publish date |
| Testimonial | Display name, quote or video URL, photo, rating, **signed consent flag (required before publish)** |
| Job opening | Title, description, open/closed status, posted date, optional close date |
| FAQ item | Question, answer, category (for grouping + SEO structured data) |
| Award | Title, issuer, year, logo |
| Leadership member | Name, title, bio, photo |
| Legal page | Structured sections per PDPL 151/2020 (data collected, purpose, retention, third-party sharing incl. SMS/payment vendors, patient rights, data-request contact) — **placeholder text pending lawyer review** |
| Anti-fraud notice | Warning copy (fake job offers, fake payment requests), contact for reporting suspected fraud |
| Contact page | Address, working hours, embeddable map, contact form fields, WhatsApp link, hotline number, patient-rights blurb |

## 5. Low-fidelity wireframes (structural, not visual)

**Homepage**
```
┌───────────────────────────────────────────┐
│ Top bar: emergency # · 24/7 support         │
├───────────────────────────────────────────┤
│ Logo   Services Doctors About News ... 🌐 EN│
├───────────────────────────────────────────┤
│  HERO: headline / subtext / [Book] [Emrg]  │
│        [ unified search bar             ]  │
├───────────────────────────────────────────┤
│  Intro copy block                          │
├───────────────────────────────────────────┤
│  Services grid (4 cards)                   │
├───────────────────────────────────────────┤
│  Centers of Excellence (interactive strip) │
├───────────────────────────────────────────┤
│  Featured doctors (cards)                  │
├───────────────────────────────────────────┤
│  News preview  |  Testimonials preview     │
├───────────────────────────────────────────┤
│  Accreditations/awards strip               │
├───────────────────────────────────────────┤
│  FAQ teaser                                │
├───────────────────────────────────────────┤
│  Footer                                    │
└───────────────────────────────────────────┘
      [ Sticky bar: Book | Find hosp. | Checkup | Specialist opinion ]
```

**Department / Center of Excellence detail**
```
┌───────────────────────────────────────────┐
│ Header + mega-menu                         │
├───────────────────────────────────────────┤
│ Hero image · Name · summary                │
├───────────────────────────────────────────┤
│ Description                                │
├───────────────────────────────────────────┤
│ Procedures/services list                   │
├───────────────────────────────────────────┤
│ Linked doctors (cards → profile links)     │
├───────────────────────────────────────────┤
│ [ Consult a <Specialty> → booking form ]   │
└───────────────────────────────────────────┘
```

**Doctor profile**
```
┌───────────────────────────────────────────┐
│ Photo | Name, title, department(s)         │
│        Languages · [ Book with Dr. X ]     │
├───────────────────────────────────────────┤
│ Bio                                         │
├───────────────────────────────────────────┤
│ Related conditions treated                  │
└───────────────────────────────────────────┘
```

**Find a Doctor**
```
┌───────────────────────────────────────────┐
│ [ By specialty ▾ ]   [ By condition ▾ ]    │
├───────────────────────────────────────────┤
│ Results grid (doctor cards)                │
└───────────────────────────────────────────┘
```

## 6. Sign-off checklist

- [ ] Page list confirmed complete (nothing missing, nothing extra)
- [ ] Nav grouping approved
- [ ] Sticky-bar 4 shortcuts + labels approved
- [ ] Per-template field lists reviewed by content owner
- [ ] Wireframe structure approved → proceed to Phase 1 visual design system
