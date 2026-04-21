# Customisation Guide

A step-by-step checklist to make this portfolio yours and deploy it to production.

---

## 1. Personal Information

Open `lib/data.ts` and update the `personalInfo` object:

```ts
export const personalInfo = {
  name: 'Your Name',
  tagline: 'YOUR ROLE',
  positioning: 'Your one-line value prop.',
  email: 'you@yourdomain.com',
  calendlyUrl: 'https://calendly.com/yourname/30min',
  upworkUrl: 'https://www.upwork.com/freelancers/yourprofile',
  stats: [
    { label: 'Years of Experience', value: '5+' },
    { label: 'Projects Shipped', value: '20+' },
    { label: 'Hours Invested', value: '10K+' },
  ],
};
```

---

## 2. Social Links

In `lib/data.ts`, update `socialLinks`:

```ts
export const socialLinks = [
  { name: 'GitHub',   url: 'https://github.com/yourusername' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile' },
  { name: 'Twitter',  url: 'https://twitter.com/yourhandle' },
];
```

---

## 3. Profile Photo

1. Add your photo to `/public/profile.jpg` (recommended: square, at least 600×600px).
2. Open `components/AboutMe.tsx` and replace the placeholder `<div>` with:

```tsx
<Image
  src="/profile.jpg"
  alt="Your Name"
  fill
  className="object-cover rounded-xl"
  priority
/>
```

---

## 4. Project Screenshots

For each project, add screenshots to `/public/projects/images/`:

| File name | Used in |
|---|---|
| `ai-analytics-dashboard.jpg` | Project 1 hero |
| `ai-analytics-dashboard-2.jpg` | Project 1 detail |
| `fintech-payment-hub.jpg` | Project 2 hero |
| `fintech-payment-hub-2.jpg` | Project 2 detail |
| `saas-subscription-manager.jpg` | Project 3 hero |
| `saas-subscription-manager-2.jpg` | Project 3 detail |
| `llm-prompt-studio.jpg` | Project 4 hero |
| `llm-prompt-studio-2.jpg` | Project 4 detail |

Recommended size: **1280×720px** (16:9), WebP or JPEG.

Then in `app/projects/[slug]/page.tsx`, uncomment the `<Image>` tags and remove the placeholder divs.

---

## 5. Technology Logos

Add logo images to `/public/logo/`. The filenames match what's in `lib/data.ts`:

```
/public/logo/js.png
/public/logo/ts.png
/public/logo/react.png
/public/logo/next.png
/public/logo/redux.png
/public/logo/tailwind.png
/public/logo/gsap.png
/public/logo/framer-motion.png
/public/logo/node.png
/public/logo/express.png
/public/logo/trpc.png
/public/logo/postgreSQL.png
/public/logo/mongodb.svg
/public/logo/prisma.png
/public/logo/langchain.png
/public/logo/openai.png
/public/logo/vectordb.png
/public/logo/git.png
/public/logo/docker.svg
/public/logo/aws.png
```

Recommended: 80×80px PNG or SVG with transparent background.

Free source: https://devicons.github.io/devicon/

---

## 6. Projects Content

In `lib/data.ts`, update each project in the `projects` array with your real work:

- `title` — project name
- `description` — one-line summary (used in list view)
- `longDescription` — 2–3 sentence overview (used in detail page header)
- `techStack` — array of technologies used
- `role` — your specific role on the project
- `liveUrl` — live demo URL
- `sourceUrl` — GitHub URL (or `"#"` if private)
- `problem` / `solution` / `result` — case study narrative
- `metrics` — quantified impact e.g. `"40% faster · $10K saved/mo"`

---

## 7. Experience

Update the `experiences` array in `lib/data.ts`:

```ts
{
  company: 'Company Name',
  role: 'Your Role',
  duration: '2023 – Present',
  description: 'What you did and why it mattered.',
  highlights: [
    'Shipped X feature used by Y users',
    'Reduced Z metric by N%',
  ],
}
```

---

## 8. Testimonials

Update the `testimonials` array in `lib/data.ts` with real client quotes.  
Add avatar images to `/public/testimonials/` and update the `avatar` field.

---

## 9. Colours

The design system lives in `app/globals.css` inside `:root {}`.  
To change the accent colour, update `--primary` and `--secondary`:

```css
/* Blue (default) */
--primary: 217 91% 60%;

/* Purple variant */
--primary: 270 70% 60%;

/* Teal variant */
--primary: 175 80% 45%;
```

---

## 10. Domain & SEO

1. Replace `https://yourdomain.com` in:
   - `app/layout.tsx` → `openGraph.url`
   - `app/robots.ts`
   - `app/sitemap.ts`

2. Replace `/og-image.png` with a real 1200×630px Open Graph image in `/public/`.

---

## 11. Analytics

1. Create `.env.local` from `.env.local.example`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Google Analytics Measurement ID:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. Add your Calendly URL:
   ```
   NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/yourname/30min
   ```

4. Update `lib/data.ts` to read from env:
   ```ts
   calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? '#',
   ```

---

## 12. Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "init: kaizen portfolio"
git remote add origin https://github.com/youruser/your-repo.git
git push -u origin main

# 2. Import project on Vercel
# Go to https://vercel.com/new and import your repo

# 3. Add environment variables in Vercel dashboard:
#    NEXT_PUBLIC_GA_ID
#    NEXT_PUBLIC_CALENDLY_URL
#    NEXT_PUBLIC_SITE_URL

# 4. Deploy — Vercel auto-detects Next.js
```

---

## 13. Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Quick Checklist Before Launch

- [ ] Personal info updated in `lib/data.ts`
- [ ] Social links updated
- [ ] Profile photo added
- [ ] Project screenshots added and `<Image>` tags uncommented
- [ ] Technology logos added to `/public/logo/`
- [ ] Real project case studies written
- [ ] Real testimonials added
- [ ] Calendly URL set in `.env.local`
- [ ] Google Analytics ID set in `.env.local`
- [ ] Domain updated in `layout.tsx`, `robots.ts`, `sitemap.ts`
- [ ] OG image created and added to `/public/og-image.png`
- [ ] `pnpm build` runs without errors
- [ ] Lighthouse score ≥ 90 on Performance, Accessibility, SEO
