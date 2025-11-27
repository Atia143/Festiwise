import "./globals.css";
import "./core-web-vitals.css";
import "./brand-system.css";
import "./brand-enhancements.css";
import "./accessibility.css";
import Navigation from "@/components/Navigation";
import ClientStructuredData from "@/components/ClientStructuredData";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import SharePrompt from "@/components/SharePrompt";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import StickyCTABar from "@/components/StickyCTABar";
import MobileOptimizedBottomSheet from "@/components/MobileOptimizedBottomSheet";
import CookieConsent from "@/components/CookieConsent";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotificationSystem from "@/components/NotificationSystem";
import ClientAnalytics from "@/components/Analytics/ClientAnalytics";
import SimpleAnalytics from "@/components/Analytics/SimpleAnalytics";
import GoogleTagManager from "@/components/Analytics/GoogleTagManager";
import GTMDebugWrapper from "@/components/Analytics/GTMDebugWrapper";
import { generateHrefLangMetadata } from "@/components/SEO/HrefLangTags";
import { Suspense } from "react";

export { generateMetadata as metadata } from '@/lib/metadata';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preload" href="/favicon.png" as="image" type="image/png" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-white">
        <GoogleTagManager gtmId="GTM-N9Z2SZGP" />
        <GTMDebugWrapper />
        <ClientStructuredData />
        <ServiceWorkerRegistration />
        <Suspense fallback={null}>
          <ClientAnalytics />
          <SimpleAnalytics />
        </Suspense>
        <ErrorBoundary>
          <Navigation />
          <StickyCTABar />
          <MobileOptimizedBottomSheet />
          <main className="pt-20">
            {children}
          </main>
          <SharePrompt />
          <AccessibilityMenu />
          <CookieConsent />
          <NotificationSystem />
        </ErrorBoundary>
        <div id="premium-features" />
      </body>
    </html>
  );
}