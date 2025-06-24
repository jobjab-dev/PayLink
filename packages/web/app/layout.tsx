import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata: Metadata = {
  title: 'PayLink - Morph L2 Payment dApp',
  description: 'Create and pay bills on Morph L2 blockchain with QR codes',
  keywords: ['Web3', 'Payment', 'Morph L2', 'Blockchain', 'QR Code', 'DeFi'],
  authors: [{ name: 'PayLink Team' }],
  creator: 'PayLink',
  publisher: 'PayLink',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://paylink.morph.network',
    title: 'PayLink - Morph L2 Payment dApp',
    description: 'Create and pay bills on Morph L2 blockchain with QR codes',
    siteName: 'PayLink',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PayLink - Morph L2 Payment dApp',
    description: 'Create and pay bills on Morph L2 blockchain with QR codes',
    creator: '@PayLinkdApp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1B4D3E' },
    { media: '(prefers-color-scheme: dark)', color: '#065F46' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PayLink" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="PayLink" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased android-tap ios-bounce windows-scroll min-h-screen overflow-x-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5`}>
        <Providers>
          <div className="relative min-h-screen">
            {/* Background gradient */}
            <div className="fixed inset-0 gradient-mesh pointer-events-none" />
            
            {/* Main layout */}
            <div className="relative z-10">
              <Navbar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 