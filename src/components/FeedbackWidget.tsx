'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WEB3FORMS_ACCESS_KEY = '00cc72fb-5e1a-4b24-b293-38bbdb1a9f33';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'experience' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `🎯 Feedback: ${feedbackType}`,
          email: email || 'Anonymous',
          message: feedbackText,
          type: feedbackType,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          _template: 'box',
          _cc: email,
          to_name: 'FestiWise Team',
          _captcha: false,
          _next: window.location.href,
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Feedback submission error:', error);
    } finally {
      setSubmitting(false);
    }
    
    setSubmitting(false);
    setSubmitted(true);
    
    // Reset after showing success message
    setTimeout(() => {
      setFeedbackType(null);
      setFeedbackText('');
      setEmail('');
      setSubmitted(false);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-40 transition-transform hover:scale-110"
        aria-label="Give feedback"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !submitting && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {!submitted ? (
                <>
                  <button
                    onClick={() => !submitting && setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={submitting}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Help us improve FestiWise</h3>
                  <p className="text-gray-600 mb-6">Your feedback directly shapes our product development</p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">What type of feedback do you have?</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          className={`py-2 px-4 rounded-md transition ${
                            feedbackType === 'bug' 
                              ? 'bg-red-100 border-2 border-red-400 text-red-800' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setFeedbackType('bug')}
                          disabled={submitting}
                        >
                          Bug Report
                        </button>
                        <button
                          type="button"
                          className={`py-2 px-4 rounded-md transition ${
                            feedbackType === 'feature' 
                              ? 'bg-green-100 border-2 border-green-400 text-green-800' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setFeedbackType('feature')}
                          disabled={submitting}
                        >
                          Feature Idea
                        </button>
                        <button
                          type="button"
                          className={`py-2 px-4 rounded-md transition ${
                            feedbackType === 'experience' 
                              ? 'bg-blue-100 border-2 border-blue-400 text-blue-800' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setFeedbackType('experience')}
                          disabled={submitting}
                        >
                          Experience
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                        Your feedback
                      </label>
                      <textarea
                        id="feedback"
                        rows={4}
                        className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={feedbackType === 'bug' ? "What went wrong? Steps to reproduce?" : 
                                    feedbackType === 'feature' ? "What would you like to see?" :
                                    "Tell us about your experience..."}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        required
                        disabled={submitting || !feedbackType}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={submitting}
                      />
                      <p className="mt-1 text-xs text-gray-500">We'll only contact you if we need clarification.</p>
                    </div>
                    
                    <button
                      type="submit"
                      className={`w-full py-3 rounded-md text-white font-medium transition ${
                        submitting || !feedbackType || !feedbackText
                          ? 'bg-purple-300 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                      disabled={submitting || !feedbackType || !feedbackText}
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </div>
                      ) : (
                        'Submit Feedback'
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">Thank you!</h3>
                  <p className="mt-2 text-gray-500">Your feedback helps make FestiWise better for everyone.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
