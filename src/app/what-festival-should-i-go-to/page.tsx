'use client';

export default function FAQ() {
  return (
    <section id="faq" className="relative px-6 py-32 bg-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-gray-100 opacity-[0.02] pointer-events-none"></div>
      <div className="absolute -left-40 bottom-0 w-80 h-80 bg-purple-50 rounded-full filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute -right-40 top-0 w-80 h-80 bg-blue-50 rounded-full filter blur-3xl opacity-30 animate-float delay-700"></div>

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to know about our festival matching service
          </p>
        </div>

        <div className="grid gap-6">
          {/* FAQ Item 1 */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  How does the festival matching work?
                </h3>
                <p className="mt-3 text-gray-500">
                  Our algorithm scores each festival based on your quiz answers—music genres, budget, preferred months, and travel region. You get a ranked list with reasons for each match, including practical tips and insider information.
                </p>
              </div>
            </div>
          </div>
          {/* FAQ Item 2 */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  Is this really unbiased?
                </h3>
                <p className="mt-3 text-gray-500">
                  Yes. FestiWise has no affiliation with any festival or ticket seller. We never accept paid placements. Rankings are determined solely by your quiz answers.
                </p>
              </div>
            </div>
          </div>
          {/* FAQ Item 3 */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  Do you sell my data?
                </h3>
                <p className="mt-3 text-gray-500">
                  Never. Your answers are used only for matching. We don't sell, share, or resell your data—period. Your privacy is our top priority.
                </p>
              </div>
            </div>
          </div>
          {/* FAQ Item 4 */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                  Can I suggest a festival?
                </h3>
                <p className="mt-3 text-gray-500">
                  Absolutely! Use our contact form or email us. We love discovering new festivals and updating our database. Your suggestions help make our recommendations even better.
                </p>
              </div>
            </div>
          </div>
          {/* FAQ Item 5 */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-50 text-pink-600 group-hover:bg-pink-100 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-300">
                  How do I get updates?
                </h3>
                <p className="mt-3 text-gray-500">
                  Subscribe to our newsletter for personalized festival recommendations and new festival discoveries — no spam, ever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}