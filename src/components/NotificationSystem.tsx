'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type definition for a notification
type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  linkText?: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
};

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [userEngaged, setUserEngaged] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Example notifications
  const demoNotifications: Notification[] = [
    {
      id: 'ticket-release',
      title: 'Ticket Alert',
      message: 'Early bird tickets for Tomorrowland 2025 go on sale this Friday!',
      type: 'info',
      link: '/festival/tomorrowland',
      linkText: 'Set Reminder',
      timestamp: new Date(),
      read: false,
      actionable: true,
    },
    {
      id: 'saved-list',
      title: 'Your Saved List',
      message: 'We found 3 new festivals that match your preferences.',
      type: 'success',
      link: '/dashboard',
      linkText: 'View Matches',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      actionable: true,
    },
    {
      id: 'nearby-event',
      title: 'Near You',
      message: 'Secret Garden Festival just announced their lineup for next month.',
      type: 'info',
      link: '/festival/secret-garden',
      linkText: 'See Lineup',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      read: false,
      actionable: false,
    },
  ];

  // Load notifications (simulate API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(demoNotifications);
      setInitialized(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show first notification after a short delay if user has not engaged yet
  useEffect(() => {
    if (!initialized || userEngaged || notifications.length === 0) return;

    const timer = setTimeout(() => {
      setShowNotification(true);

      // Auto-hide after 7 seconds
      const hideTimer = setTimeout(() => {
        setShowNotification(false);
        setTimeout(() => {
          setNotificationIndex((prev) => (prev + 1) % notifications.length);
        }, 400);
      }, 7000);

      return () => clearTimeout(hideTimer);
    }, 1800);

    return () => clearTimeout(timer);
  }, [initialized, userEngaged, notifications, notificationIndex]);

  // Handle notification actions
  const handleNotificationInteraction = (
    action: 'dismiss' | 'read' | 'click',
    notificationId: string
  ) => {
    setUserEngaged(true);
    setShowNotification(false);
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    // Move to next notification after animation
    setTimeout(() => {
      setNotificationIndex((prev) => (prev + 1) % notifications.length);
    }, 400);

    // Analytics event could go here
    // console.log(`User ${action}ed notification: ${notificationId}`);
  };

  const currentNotification = notifications[notificationIndex];

  if (!initialized || !currentNotification) {
    return null;
  }

  // Color styling based on type
  const getColorScheme = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-300 text-blue-900';
      case 'success':
        return 'bg-green-50 border-green-300 text-green-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-300 text-yellow-900';
      case 'error':
        return 'bg-red-50 border-red-300 text-red-900';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-900';
    }
  };

  // Notification icon by type
  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'success':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M16 9l-4 4-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M15 9l-6 6m0-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Responsive position: bottom for mobile, right for desktop
  // Use tailwind's responsive classes: right-4 left-4 w-[95vw] for mobile, right-6 bottom-6 max-w-sm for desktop
  return (
    <div
      className="
        fixed z-50
        w-full max-w-sm sm:max-w-md
        left-1/2 -translate-x-1/2 bottom-4
        sm:left-auto sm:right-6 sm:translate-x-0 sm:bottom-8
        px-2 sm:px-0
        pointer-events-none
      "
      aria-live="polite"
    >
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`
              pointer-events-auto
              border shadow-xl rounded-2xl
              p-4 sm:p-5
              flex items-start gap-3
              ${getColorScheme(currentNotification.type)}
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">{getIcon(currentNotification.type)}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-base truncate">{currentNotification.title}</p>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {currentNotification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="mt-1 text-sm">{currentNotification.message}</p>
              {currentNotification.link && (
                <div className="mt-3">
                  <a
                    href={currentNotification.link}
                    className="inline-block text-sm font-medium text-blue-600 hover:underline focus:underline active:underline transition"
                    onClick={() => handleNotificationInteraction('click', currentNotification.id)}
                  >
                    {currentNotification.linkText || 'Learn more'}
                  </a>
                </div>
              )}
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 bg-white/80 text-gray-800 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  onClick={() => handleNotificationInteraction('dismiss', currentNotification.id)}
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  onClick={() => {
                    setShowNotification(false);
                    setUserEngaged(true);
                    // In production, update user preferences to show fewer notifications
                  }}
                >
                  Show less like this
                </button>
              </div>
            </div>
            {/* Close button */}
            <button
              className="ml-2 mt-0.5 bg-transparent rounded-full inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              onClick={() => handleNotificationInteraction('dismiss', currentNotification.id)}
              aria-label="Close"
              tabIndex={0}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}