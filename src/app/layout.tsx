import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { loadProfile } from '@/lib/content';
import { site } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s, ${site.name}` },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Suraj Suresh portfolio' }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = loadProfile();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Applies the saved theme before first paint so there is no flash; without JS the CSS media query applies.
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();",
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteHeader resumeHref={profile.resume.path} resumeDownloadName={profile.resume.downloadName} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter profile={profile} />
      </body>
    </html>
  );
}
