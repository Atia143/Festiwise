'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-12">Last updated: August 30, 2025</p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to FestiWise</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service govern your use of FestiWise, our festival recommendation 
                platform. By using our service, you agree to these terms.
              </p>
            </div>

            <div className="space-y-8">
              <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  FestiWise is a free platform that helps you discover music festivals based on your 
                  preferences. We provide recommendations but are not responsible for festival organization, 
                  ticketing, or event management.
                </p>
              </section>

              <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">User Responsibilities</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Provide accurate information in quiz responses</li>
                  <li>• Use the service for personal, non-commercial purposes</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Do not attempt to harm or disrupt the service</li>
                </ul>
              </section>

              <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Disclaimers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Festival information is provided for reference and may change</li>
                  <li>• We are not responsible for festival cancellations or changes</li>
                  <li>• Always verify details directly with festival organizers</li>
                  <li>• Recommendations are based on available data and algorithms</li>
                </ul>
              </section>

              <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                <p className="text-gray-600 leading-relaxed">
                  FestiWise provides recommendations as-is. We are not liable for any damages resulting 
                  from festival attendance, travel, or other decisions made based on our recommendations.
                </p>
              </section>

              <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Changes to Terms</h3>
                <p className="text-gray-600 leading-relaxed">
                  We may update these terms from time to time. Continued use of the service constitutes 
                  acceptance of updated terms.
                </p>
              </section>

              <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h3>
                <p className="text-gray-600">
                  Questions about these terms? Contact us at{' '}
                  <a href="mailto:pixelplus.contact@gmail.com" className="text-purple-600 hover:text-purple-700 underline">
                    pixelplus.contact@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
