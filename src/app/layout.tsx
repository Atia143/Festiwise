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
import PerformanceOptimizer, { ConnectionAwareComponent } from "@/components/PerformanceOptimizer";
import CookieConsent from "@/components/CookieConsent";
import ErrorBoundary from "@/components/ErrorBoundary";
import GoogleTagManager from "@/components/Analytics/GoogleTagManager";
import GTMDebugWrapper from "@/components/Analytics/GTMDebugWrapper";
import { ToastProvider } from "@/components/Toast/ToastProvider";
import { CompareProvider } from "@/contexts/CompareContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import ConditionalFloatingUI from "@/components/ConditionalFloatingUI";
import TrustFooter from "@/components/TrustFooter";
import { Suspense } from "react";

export { generateMetadata } from '@/lib/metadata';

import type { Viewport } from 'next';
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

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
       <link rel="icon" type="image/svg+xml" href="/festiwise-favicon.svg"/>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap"
        />
      </head>
      <body className="min-h-screen bg-white">
        {/* Performance Optimizers - Invisible but powerful */}
        <PerformanceOptimizer />
        <ConnectionAwareComponent />
        
        <GoogleTagManager gtmId="GTM-N9Z2SZGP" />
        <GTMDebugWrapper />
        <ClientStructuredData />
        <ServiceWorkerRegistration />

        <ErrorBoundary>
          <CurrencyProvider>
          <CompareProvider>
            <ToastProvider>
              <Navigation />
              <StickyCTABar />
              <main className="pt-[96px]">
                {children}
              </main>
              <TrustFooter />
              <SharePrompt />
              <AccessibilityMenu />
              <CookieConsent />
              <ConditionalFloatingUI />
            </ToastProvider>
          </CompareProvider>
          </CurrencyProvider>
        </ErrorBoundary>
        <div id="premium-features" />
      </body>
    </html>
  );
}