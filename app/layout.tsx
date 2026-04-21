import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import StickyEmail from '@/components/StickyEmail';
import Preloader from '@/components/Preloader';
import ParticleBackground from '@/components/ParticleBackground';
import SmoothScroll from '@/components/SmoothScroll';
import ThemeProvider from '@/components/ThemeProvider';
import { personalInfo } from '@/lib/data';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'),
  title: {
    default: `${personalInfo.name} — Frontend Engineer`,
    template: `%s | ${personalInfo.name}`,
  },
  description: personalInfo.positioning,
  keywords: ['Frontend Engineer','React Developer','Next.js','SaaS','Fintech','AI Dashboard','TypeScript','Tailwind CSS'],
  authors: [{ name: personalInfo.name }],
  creator: personalInfo.name,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
    apple: '/favicon-180.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: `${personalInfo.name} — Portfolio`,
    title: `${personalInfo.name} — Frontend Engineer`,
    description: personalInfo.positioning,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${personalInfo.name} — Frontend Engineer Portfolio` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${personalInfo.name} — Frontend Engineer`,
    description: personalInfo.positioning,
    images: ['/og-image.png'],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

// Runs before first paint — prevents flash of wrong theme
const FLASH_SCRIPT = `(function(){try{
  var b=localStorage.getItem('theme-base')||'dark';
  var a=localStorage.getItem('theme-accent')||'blue';
  var B={dark:{'--background':'222 20% 8%','--background-light':'222 18% 12%','--foreground':'220 13% 91%','--muted':'220 9% 20%','--muted-foreground':'220 9% 65%','--border':'220 13% 20%'},light:{'--background':'210 20% 97%','--background-light':'210 20% 92%','--foreground':'222 20% 10%','--muted':'210 20% 86%','--muted-foreground':'215 16% 46%','--border':'214 32% 82%'}};
  var A={blue:{'--primary':'217 91% 60%','--primary-hover':'217 91% 55%','--secondary':'200 95% 55%','--ring':'217 91% 60%','--primary-foreground':'0 0% 100%'},red:{'--primary':'0 84% 60%','--primary-hover':'0 84% 54%','--secondary':'0 90% 70%','--ring':'0 84% 60%','--primary-foreground':'0 0% 100%'},green:{'--primary':'142 70% 45%','--primary-hover':'142 70% 40%','--secondary':'160 84% 39%','--ring':'142 70% 45%','--primary-foreground':'0 0% 100%'},purple:{'--primary':'270 70% 60%','--primary-hover':'270 70% 54%','--secondary':'280 60% 65%','--ring':'270 70% 60%','--primary-foreground':'0 0% 100%'},orange:{'--primary':'25 95% 53%','--primary-hover':'25 95% 47%','--secondary':'38 92% 50%','--ring':'25 95% 53%','--primary-foreground':'0 0% 100%'}};
  var r=document.documentElement;
  var bv=B[b]||B.dark; var av=A[a]||A.blue;
  for(var k in bv)r.style.setProperty(k,bv[k]);
  for(var k in av)r.style.setProperty(k,av[k]);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon-32.png" />
        {/* Flash prevention — must run before body renders */}
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
          <SmoothScroll>
            <Preloader />
            <div className="noise-overlay" aria-hidden="true" />
            <ParticleBackground />
            <ScrollProgress />
            <CustomCursor />
            <StickyEmail />
            <Navbar />
            <main id="main-content" className="relative z-10">
              {children}
            </main>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
