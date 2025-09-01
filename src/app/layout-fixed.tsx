import "./globals.css";
import type { Metadata } from "next";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  metadataBase: new URL('https://getfestiwise.com'),
  title: {
    default: 'FestiWise: Find Your Perfect Music Festival in 2 Minutes | 100+ World-Class Events',
    template: '%s | FestiWise'
  },
  description: 'Discover your ideal music festival from 100 world-class events worldwide. Take our free 2-minute quiz for personalized recommendations by genre, budget & location.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.png'
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Simple Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BDQF8TX7MF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BDQF8TX7MF');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        {/* Beautiful loading screen - CSS only, no conflicts */}
        <div id="festiwise-loader" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #581c87, #3730a3, #be185d)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          transition: 'opacity 0.5s ease'
        }}>
          <div style={{textAlign: 'center', color: 'white'}}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              animation: 'festiBounce 1s infinite'
            }}>🎪</div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>FestiWise</div>
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes festiBounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
            #festiwise-loader.fade-out {
              opacity: 0;
              pointer-events: none;
            }
          `
        }} />
        
        <Navigation />
        <main className="pt-20">
          {children}
        </main>
        
        {/* Safe loading removal - no React conflicts */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function hideLoader() {
                const loader = document.getElementById('festiwise-loader');
                if (loader) {
                  loader.classList.add('fade-out');
                  setTimeout(() => loader.remove(), 500);
                }
              }
              
              if (document.readyState === 'complete') {
                setTimeout(hideLoader, 800);
              } else {
                window.addEventListener('load', () => setTimeout(hideLoader, 800));
              }
            })();
          `
        }} />
      </body>
    </html>
  );
}
