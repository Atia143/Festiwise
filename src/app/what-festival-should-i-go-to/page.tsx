// src/app/what-festival-should-i-go-to/page.tsx

import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import FAQ from "@/components/FAQ";

/**
 * WhatFestivalPage – SEO anchor page for "What festival should I go to?"
 * Features: Hero, value proposition, embedded quiz CTA, FAQ, and newsletter.
 * Optimized for organic traffic and high conversion.
 */
export const metadata = {
  title: "What festival should I go to? | Festival Finder",
  description: "Take our smart quiz and get matched with music festivals that fit your vibe, budget, and travel plans.",
  openGraph: {
    title: "What festival should I go to? | Festival Finder",
    description: "Take our smart quiz and get matched with music festivals that fit your vibe, budget, and travel plans.",
    url: "https://getfestiwise.com/what-festival-should-i-go-to",
    siteName: "Festival Finder",
    images: [],
    locale: "en_US",
    type: "website",
  },
};

export default function WhatFestivalPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-[90vh] px-6 py-24 md:py-32 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 text-white overflow-hidden relative flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[url('/globe.svg')] opacity-10 bg-repeat-space animate-float"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-700"></div>
        
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="space-y-8 animate-fadeIn">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6 transform hover:scale-105 transition-all">
              <span className="animate-pulse mr-2 h-2 w-2 bg-green-400 rounded-full"></span>
              2,000+ Festivals Indexed
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-100 animate-gradient">
                What festival should
              </span>
              <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-100 animate-gradient delay-150">
                I go to?
              </span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto leading-relaxed opacity-90">
              Overwhelmed by options? Our AI-powered quiz matches you with music festivals that fit your taste, budget, and travel plans. 
              <span className="block mt-2 font-medium">No fluff—just clarity.</span>
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/quiz"
                className="group relative px-8 py-4 rounded-xl bg-white text-purple-600 font-semibold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out"
              >
                <span className="relative z-10 flex items-center">
                  Take the quiz
                  <span className="inline-block transition-transform group-hover:translate-x-2 ml-2 duration-300">→</span>
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Link>

              <a
                href="#faq"
                className="group px-8 py-4 rounded-xl border-2 border-white/80 text-white font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Read FAQ
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-16 pt-8 border-t border-white/20 flex justify-center items-center gap-8 text-sm text-white/70">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                100% Free
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacy First
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant Results
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="relative px-6 py-32 bg-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-gray-100 opacity-[0.02] pointer-events-none"></div>
        <div className="absolute -left-40 -top-40 w-80 h-80 bg-purple-50 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-blue-50 rounded-full filter blur-3xl opacity-30 animate-float delay-700"></div>
        
        <div className="relative mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              How does it work?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Find your perfect festival match in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative bg-gradient-to-b from-purple-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              <div className="relative flex items-start mb-6">
                <div className="flex-shrink-0 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-3 shadow-lg group-hover:shadow-purple-500/25 transition-shadow duration-500">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matching</h3>
                  <p className="text-gray-600 leading-relaxed">Our quiz analyzes your music taste, budget, preferred months, and travel region for perfect matches.</p>
                </div>
              </div>
              <div className="relative pl-16">
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Music genre analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Budget optimization
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Travel preferences
                  </li>
                </ul>
              </div>
            </div>
            <div className="group relative bg-gradient-to-b from-blue-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              <div className="relative flex items-start mb-6">
                <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-500">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Data</h3>
                  <p className="text-gray-600 leading-relaxed">We hand-pick festivals worldwide—no paid placements, no bias. Just genuine recommendations.</p>
                </div>
              </div>
              <div className="relative pl-16">
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Verified festivals only
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Regular updates
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unbiased recommendations
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-gradient-to-b from-indigo-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              <div className="relative flex items-start mb-6">
                <div className="flex-shrink-0 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-3 shadow-lg group-hover:shadow-indigo-500/25 transition-shadow duration-500">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Clear Results</h3>
                  <p className="text-gray-600 leading-relaxed">Get top matches with practical tips, links, and reasons why each festival fits you perfectly.</p>
                </div>
              </div>
              <div className="relative pl-16">
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Personalized matches
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Detailed insights
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Practical tips
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-gradient-to-b from-violet-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              <div className="relative flex items-start mb-6">
                <div className="flex-shrink-0 bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl p-3 shadow-lg group-hover:shadow-violet-500/25 transition-shadow duration-500">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
                  <p className="text-gray-600 leading-relaxed">We never sell your data. Your answers are used only for matching—nothing else.</p>
                </div>
              </div>
              <div className="relative pl-16">
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-violet-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No data sharing
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-violet-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Secure matching
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-violet-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    GDPR compliant
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link
              href="/quiz"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Start the quiz
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Newsletter Signup */}
      <NewsletterForm />

      {/* Trust & Privacy Footer */}
      <footer className="relative px-6 py-12 border-t bg-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100 opacity-[0.02] pointer-events-none"></div>
        <div className="relative mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">About Us</h4>
              <p className="text-sm text-gray-600">
                Festival Finder helps music lovers discover their perfect festival match through personalized recommendations and expert curation.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Our Promise</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unbiased recommendations
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No data selling
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Regular updates
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Built with care. We don't sell your data. Recommendations are independent; affiliate links don't affect scores.
            </p>
          </div>
        </div>
      </footer>

      {/* Newsletter Signup */}
      <NewsletterForm />

      {/* Trust & Privacy Footer */}
      <footer className="px-6 py-10 border-t">
        <div className="mx-auto max-w-3xl text-sm text-neutral-600">
          Built with care. We don’t sell your data. Recommendations are independent; affiliate links don’t affect scores.
        </div>
      </footer>
    </main>
  );
}
