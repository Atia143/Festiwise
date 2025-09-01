'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-12">Last updated: August 30, 2025</p>

                    <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                At FestiWise, we are committed to protecting your privacy and ensuring transparency about how we collect, use, and protect your personal information. This policy explains our practices in plain language.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Information You Provide</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                  <li>Email address when you subscribe to our newsletter</li>
                  <li>Quiz responses about your music and festival preferences</li>
                  <li>Feedback and messages you send us</li>
                  <li>Survey responses (when you choose to participate)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Information Automatically Collected</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Website usage data (pages visited, time spent, clicks)</li>
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and general location (country/region)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Personalized Recommendations:</strong> To match you with festivals based on your preferences</li>
                  <li><strong>Newsletter:</strong> To send you festival updates and recommendations (only if you subscribe)</li>
                  <li><strong>Website Improvement:</strong> To understand how our site is used and make it better</li>
                  <li><strong>Customer Support:</strong> To respond to your questions and feedback</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-semibold">⭐ We DO NOT sell your personal information to third parties.</p>
                </div>
                
                <p className="text-gray-600 mb-4">We may share information only in these limited circumstances:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted partners who help us operate our website (hosting, analytics, email delivery)</li>
                  <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Rights and Choices</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Rights (GDPR & CCPA)</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                  <li><strong>Access:</strong> Request a copy of the personal information we have about you</li>
                  <li><strong>Correction:</strong> Ask us to correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Receive your information in a machine-readable format</li>
                  <li><strong>Objection:</strong> Object to processing of your information</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">How to Exercise Your Rights</h3>
                <p className="text-gray-600 mb-4">Contact us at <a href="mailto:privacy@festiwise.com" className="text-purple-600 underline">privacy@festiwise.com</a> or use our <a href="/contact" className="text-purple-600 underline">contact form</a>. We will respond within 30 days.</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800"><strong>Newsletter Unsubscribe:</strong> Click the unsubscribe link in any email or contact us directly.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
                <p className="text-gray-600 mb-4">We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our website</li>
                  <li>Improve our services and user experience</li>
                  <li>Provide relevant content and recommendations</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie Types</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Essential Cookies</h4>
                    <p className="text-sm text-gray-600">Required for basic website functionality. Cannot be disabled.</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">Help us understand website usage patterns (Google Analytics).</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Preference Cookies</h4>
                    <p className="text-sm text-gray-600">Remember your settings and quiz responses locally.</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600">Currently not used. Future affiliate tracking (with consent).</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-600 mb-4">We implement appropriate security measures to protect your information:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure hosting with regular security updates</li>
                  <li>Limited access to personal information (need-to-know basis)</li>
                  <li>Regular security assessments and monitoring</li>
                  <li>Data minimization (we only collect what we need)</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Transfers</h2>
                <p className="text-gray-600 mb-4">
                  FestiWise operates globally. Your information may be transferred to and processed in countries other than your own, including the United States. We ensure appropriate safeguards are in place for international transfers in compliance with applicable data protection laws.
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700"><strong>EU-US Data Transfers:</strong> We comply with applicable adequacy decisions and use Standard Contractual Clauses where required.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                <p className="text-gray-600">
                  Our service is not intended for children under 16 years old. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe we have collected information about your child, please contact us immediately.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                <p className="text-gray-600 mb-4">
                  We may update this privacy policy from time to time. We will notify you of significant changes by:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending an email notification (if you're subscribed)</li>
                  <li>Displaying a prominent notice on our homepage</li>
                </ul>
                <p className="text-gray-600">Continued use of our service after changes indicates your acceptance of the updated policy.</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-purple-900 mb-4">10. Contact Us</h2>
                <p className="text-purple-800 mb-4">
                  If you have questions about this privacy policy or our privacy practices, please contact us:
                </p>
                <div className="space-y-2 text-purple-800">
                  <p><strong>Email:</strong> <a href="mailto:privacy@festiwise.com" className="underline">privacy@festiwise.com</a></p>
                  <p><strong>General Contact:</strong> <a href="mailto:hello@festiwise.com" className="underline">hello@festiwise.com</a></p>
                  <p><strong>Contact Form:</strong> <a href="/contact" className="underline">festiwise.com/contact</a></p>
                  <p><strong>Response Time:</strong> We aim to respond within 48-72 hours</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-purple-200">
                  <p className="text-sm text-purple-700">
                    <strong>Data Protection Officer:</strong> For EU-related inquiries, contact our DPO at <a href="mailto:dpo@festiwise.com" className="underline">dpo@festiwise.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
