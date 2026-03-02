'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';

// Web3Forms access key moved to server env var; client posts to `/api/submit`.

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          from_name: formData.name,
          email: formData.email,
          subject: `[FestiWise Contact] ${formData.subject || 'General Inquiry'}`,
          message: formData.message,
          _template: 'box',
          _cc: formData.email,
          botcheck: '',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or need help finding your perfect festival? 
              We're here to help and would love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="festival-suggestion">Festival Suggestion</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="press">Press & Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <TextArea
                  label="Message"
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                />

                {/* Status Messages */}
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <h4 className="font-bold text-green-900">Message Sent!</h4>
                        <p className="text-sm text-green-700">Thank you for reaching out! We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">❌</span>
                      <div>
                        <h4 className="font-bold text-red-900">Sending Failed</h4>
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={!formData.name || !formData.email || !formData.subject || !formData.message || isSubmitting || submitSuccess}
                >
                  {isSubmitting ? 'Sending...' : submitSuccess ? '✅ Message Sent!' : 'Send Message'}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-8"
            >
              {/* Quick Contact */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">General & Support</p>
                      <a href="mailto:pixelplus.contact@gmail.com" className="text-purple-600 hover:text-purple-700">
                        pixelplus.contact@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💼</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Press & Business</p>
                      <a href="mailto:yuval.atia@icloud.com" className="text-green-600 hover:text-green-700">
                        yuval.atia@icloud.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Need Quick Answers?</h3>
                <p className="text-white/90 mb-6">
                  Check out our FAQ section for instant answers to common questions about festivals, 
                  our recommendations, and how FestiWise works.
                </p>
                <a
                  href="/faq"
                  className="inline-block px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
                >
                  Visit FAQ
                </a>
              </div>

              {/* Response Time */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Response Times</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>General Inquiries</span>
                    <span className="font-medium">1-3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bug Reports</span>
                    <span className="font-medium">1-3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Festival Suggestions</span>
                    <span className="font-medium">1-3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Press & Business</span>
                    <span className="font-medium">1-3 days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
