import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

// Two faces, total: Geist Sans (a neo-grotesque in the Inter/Helvetica Now
// family) carries display AND body; Geist Mono carries every micro-label.
// The decorative Sekuya display face was removed deliberately — in the
// International Typographic style hierarchy comes from scale and whitespace,
// not from introducing a second personality.

import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import StickyEmail from '@/components/StickyEmail';
import SoundProvider from '@/components/SoundProvider';
import ThemeProvider from '@/components/ThemeProvider';
import MagneticCursor from '@/components/motion/MagneticCursor';
import MagneticField from '@/components/motion/MagneticField';
import CosmicBackdrop from '@/components/CosmicBackdrop';
import { personalInfo } from '@/lib/data';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#080808' },
    { media: '(prefers-color-scheme: dark)', color: '#080808' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mekaizen.netlify.app/'),
  title: { default: `${personalInfo.name} — FullStack Developer`, template: `%s | ${personalInfo.name}` },
  description: personalInfo.positioning,
  keywords: ['Frontend Engineer','React Developer','Next.js','SaaS','Fintech','AI Dashboard','TypeScript','Tailwind CSS'],
  authors: [{ name: personalInfo.name }],
  creator: personalInfo.name,
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    shortcut: '/favicon-32.png',
    apple: '/favicon-180.png',
  },
  openGraph: {
    type: 'website', locale: 'en_US', url: 'https://mekaizen.netlify.app/',
    siteName: `${personalInfo.name} — Portfolio`,
    title: `${personalInfo.name} — FullStack Developer`,
    description: personalInfo.positioning,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${personalInfo.name} — FullStack Developer Portfolio` }],
  },
  twitter: { card: 'summary_large_image', title: `${personalInfo.name} — FullStack Developer`, description: personalInfo.positioning, images: ['/og-image.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

// Paints the saved theme onto <html> before first paint, so a light-theme
// visitor never gets a dark flash (and vice versa).
//
// ── This script MUST mirror three things, and they are hand-copied ──────────
//
//   1. `baseModes` / `buildCSSVars`      → lib/theme.ts
//   2. `applyCustomAccent`               → components/ThemeProvider.tsx
//   3. `LIGHT_VARIANTS` / `DARK_VARIANTS`→ components/ThemeProvider.tsx
//
// They have already drifted once: this defaulted to 'light' while its own
// `light` entry held the DARK palette, so anyone who had actually chosen light
// mode got a full dark repaint on every page load until React hydrated. If you
// change any of the three sources, change this too.
//
// It also used to restore ONLY the base mode and then hardcode the yellow
// accent — so a visitor who had picked a custom accent, or a Midnight/Espresso
// background, was painted yellow-on-black for a frame and then snapped to
// their real theme once ThemeProvider's restore effect ran. Everything the
// provider persists is restored here now, and in the SAME ORDER the provider
// applies it: base palette → accent preset → custom accent override →
// background variant. Any other order lets an earlier step win.
//
// `--accent` is deliberately NOT touched by the accent step. It is the neutral
// SURFACE token (Tailwind maps `bg-accent` to it); painting the picked colour
// into it turns every accent-coloured surface on the site into that hue. The
// tokens that genuinely follow the accent are --primary, its hover tint, the
// focus ring, and --primary-ink (the same colour, made legible as type).
const FLASH_SCRIPT = `(function(){try{
  var r=document.documentElement;
  var b=localStorage.getItem('theme-base')||'dark';
  var B={
    light:{'--background':'0 0% 97%','--background-light':'0 0% 100%','--foreground':'0 0% 9%','--foreground-muted':'0 0% 38%','--muted-foreground':'0 0% 38%','--muted':'0 0% 88%','--border':'0 0% 84%','--input':'0 0% 84%','--secondary':'0 0% 12%','--secondary-foreground':'0 0% 97%','--primary-ink':'44 100% 27%','--accent':'0 0% 100%','--accent-foreground':'0 0% 9%'},
    dark: {'--background':'0 0% 3%','--background-light':'0 0% 4%','--foreground':'60 3% 93%','--foreground-muted':'56 5% 56%','--muted-foreground':'56 5% 56%','--muted':'56 5% 56%','--border':'0 0% 14%','--input':'0 0% 14%','--secondary':'0 0% 95%','--secondary-foreground':'0 0% 12%','--primary-ink':'50 100% 60%','--accent':'0 0% 4%','--accent-foreground':'60 3% 93%'}
  };
  var A={'--primary':'50 100% 60%','--primary-hover':'50 100% 50%','--ring':'50 100% 60%','--primary-foreground':'0 0% 8%'};
  var bv=B[b]||B.dark;
  for(var k in bv)r.style.setProperty(k,bv[k]);
  for(var k in A)r.style.setProperty(k,A[k]);

  /* Custom accent — mirrors hexToHslTriplet (lib/color.ts) + applyCustomAccent. */
  var hex=localStorage.getItem('theme-custom-accent');
  if(hex&&/^#?[0-9a-fA-F]{6}$/.test(hex)){
    var c=hex.charAt(0)==='#'?hex.slice(1):hex;
    var R=parseInt(c.slice(0,2),16)/255,G=parseInt(c.slice(2,4),16)/255,Bl=parseInt(c.slice(4,6),16)/255;
    var mx=Math.max(R,G,Bl),mn=Math.min(R,G,Bl),d=mx-mn,l=(mx+mn)/2,h=0,s=0;
    if(d!==0){
      s=d/(1-Math.abs(2*l-1));
      if(mx===R)h=60*(((G-Bl)/d)%6);else if(mx===G)h=60*((Bl-R)/d+2);else h=60*((R-G)/d+4);
    }
    if(h<0)h+=360;
    h=Math.round(h);s=Math.round(s*100);l=Math.round(l*100);
    r.style.setProperty('--primary',h+' '+s+'% '+l+'%');
    r.style.setProperty('--primary-hover',h+' '+s+'% '+Math.max(0,l-8)+'%');
    r.style.setProperty('--ring',h+' '+s+'% '+l+'%');
    /* On light paper an accent lighter than ~32% is unreadable as type. */
    r.style.setProperty('--primary-ink',h+' '+s+'% '+(b==='light'?Math.min(l,32):l)+'%');
  }

  /* Background variant. 'pure' means "leave what the base already set". */
  var LV={milky:['40 32% 95%','40 45% 99%'],frost:['210 28% 96%','210 45% 100%']};
  var DV={midnight:['224 35% 8%','224 28% 12%'],espresso:['24 20% 9%','24 16% 13%']};
  var vk=localStorage.getItem(b==='dark'?'theme-dark-variant':'theme-light-variant');
  var v=(b==='dark'?DV:LV)[vk];
  if(v){r.style.setProperty('--background',v[0]);r.style.setProperty('--background-light',v[1]);}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon-32.png" />
        <script dangerouslySetInnerHTML={{ __html: FLASH_SCRIPT }} />
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname});` }} />
          </>
        )}
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          {/* No preloader. The page paints as soon as it can — a curtain over
              a portfolio only ever adds time to the thing it is hiding. The
              pre-paint theme script above is what stops that first paint being
              the wrong colour; it is doing MORE work now, not less. */}
          <CosmicBackdrop />
          <div className="noise-overlay" aria-hidden="true" />
          {/* SpotlightCursor removed: it painted a soft accent-coloured radial
              gradient under the pointer, which is exactly the ambient glow the
              Swiss direction rules out — and MagneticCursor already provides a
              (sharp, hairline) custom cursor. Re-add the import + tag below to
              restore it. */}
          <MagneticCursor />
          {/* Drives every `data-magnetic` button on the site — see the note in
              MagneticField for why this is one controller and not a wrapper. */}
          <MagneticField />
          <ScrollProgress />
          <StickyEmail />
          <Navbar />
          <SoundProvider />
          {/*
            NO `z-10` here — that was a site-wide bug, not a style choice.
            `position: relative` + `z-index: 10` made <main> a stacking context,
            which permanently capped every descendant: the navbar (z-60),
            ScrollProgress (z-9996) and the route-transition stage (z-9995) are
            SIBLINGS of <main>, so nothing rendered by a page could ever paint
            above them no matter how large its z-index. Measured consequence:
            the /idea drawer at z-[401] was painting *under* the mobile navbar,
            and a hit-test at its own centre returned the nav.

            Dropping z-index (keeping `position: relative`, which pages rely on
            as a containing block) lets page-level overlays join the root
            stacking context and out-rank the chrome, as their z-indices always
            intended. The ambient background layers that used to sit "below"
            main via z-0/z-1 are re-based to negative z-index in globals.css so
            they stay behind the content.
          */}
          <main id="main-content" className="relative">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}