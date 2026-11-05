# Mridula Mistry · Portfolio

Static site. No framework, no build step. Deployed on Vercel from `main`.

## Structure

```
/
├── index.html              Home
├── about.html              About (served at /about)
├── 404.html                Not-found page
├── case-studies/           Case studies (served at /case-studies/<name>)
│   ├── campaign-manager.html
│   ├── mailq.html
│   └── rephrase.html
├── css/
│   ├── base.css            Tokens, fonts, reset, nav, buttons, footer (every page)
│   ├── home.css            Home only: hero, work, fixes, testimonials, contact
│   ├── about.css           About only: portrait, write-up, principles, jobs, gallery
│   └── style.css           Legacy styles still used by the case studies
├── js/
│   ├── main.js             Every page: nav, reveal-on-scroll, toggles, footer trail
│   ├── home.js             Home: Story/TL;DR, contact toggle, fix preview, tickers
│   ├── sky.js              Home: WebGL cloud sky in the hero (shader inline)
│   └── about.js            About: scroll-fill write-up
├── fonts/                  Self-hosted woff2 (Figtree, Instrument Serif + legacy case-study fonts)
├── images/
│   ├── home/               Hero, work cards, fix screenshots, avatars/
│   ├── about/              Portrait, life/ gallery, certificates/
│   ├── shared/             Footer image
│   ├── case-studies/       Case-study images
│   ├── social/             Open Graph share images (1200×630)
│   └── mm-favicon.svg, icon-192.png, icon-512.png
├── favicon.ico, apple-touch-icon.png, site.webmanifest
├── robots.txt, sitemap.xml
└── vercel.json             Clean URLs, cache and security headers, /resume → Google Drive
```

Resume: lives on Google Drive (Anyone with the link → Viewer). To update it, use Drive → Manage versions → Upload new version on the same file so the link never changes. The link is in index.html, about.html, js/home.js and vercel.json.

Conventions: root-absolute paths (`/css/...`, `/images/...`), lowercase kebab-case file names, WebP for photos, every `<img>` has width and height, scripts load with `defer`, no inline styles.

## Run locally

```
npx serve .          # or: python3 -m http.server 8000
```
`npx serve` honours clean URLs (`/about`). With the Python server use `/about.html`.

## Deploy / migration

This repo replaces the old site in `mridula07/mridula-portfolio`. Old case-study URLs keep working:
- `/case-studies/mailq.html` → redirects to `/case-studies/mailq` (Vercel `cleanUrls`)
- `/#work`, `/#about`, `/#kind` anchors still exist on the new home page

Steps:
1. In the old repo, make a branch or tag first so the old site is recoverable: `git tag old-site-2026 && git push --tags`.
2. Replace the repo contents with this folder (keep `.git`), commit, push to `main`.
3. Vercel redeploys automatically. Check `/`, `/about`, the three case studies, `/resume` (opens Drive) and a random URL for the 404.

Removed from the old site (no longer referenced): `audio/`, old `js/` (6 files), old `css/` except `style.css`, and 43 home-page images and stickers in `images/`. They stay in git history.

## When the domain changes

The live URL is hard-coded in canonical, Open Graph, JSON-LD, `robots.txt` and `sitemap.xml`. Replace it everywhere at once:
```
grep -rl "mridula-portfolio-five.vercel.app" . | xargs sed -i '' 's#mridula-portfolio-five.vercel.app#yourdomain.com#g'
```
Then add the domain in Vercel → Project → Domains and set the vercel.app URL to redirect to it.

## Search (Google)

1. Google Search Console → add a Domain property (DNS verification) or a URL-prefix property (paste the `google-site-verification` meta tag where the Analytics comment sits in each `<head>`).
2. Submit `/sitemap.xml`.
3. URL Inspection → request indexing for `/` and `/about`.
4. Update `<lastmod>` in `sitemap.xml` when pages change.

## Analytics (later)

Each page `<head>` has an `Analytics` comment marking where snippets go.
- Microsoft Clarity: create a project, paste its script there on every page (including the three case studies).
- Google Analytics 4 (optional): paste the `gtag.js` snippet in the same place.
- Clarity records sessions: add a short privacy note in the footer when it goes live.
- If a Content-Security-Policy header is ever added to `vercel.json`, allow `www.clarity.ms` and `www.googletagmanager.com`.

## Checks before every push

- Pages at 1440, 820 and 390 widths: no horizontal scroll, no console errors.
- Share preview: paste the URL into LinkedIn Post Inspector (linkedin.com/post-inspector).
- Lighthouse in Chrome DevTools: aim for 90+ on Performance, Accessibility, SEO.
