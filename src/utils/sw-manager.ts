// utils/sw-manager.ts - Service Worker Registration & Management
'use client';

import { Workbox } from 'workbox-window';

class ServiceWorkerManager {
  private wb: Workbox | null = null;
  private updateAvailable = false;
  private registrationPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    // Only register in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Service Worker disabled in development');
      return;
    }

    if (this.registrationPromise) {
      return this.registrationPromise;
    }

    this.registrationPromise = this.registerServiceWorker();
    return this.registrationPromise;
  }

  private async registerServiceWorker(): Promise<void> {
    try {
      this.wb = new Workbox('/sw.js');

      // Service Worker lifecycle events
      this.wb.addEventListener('installed', (event) => {
        console.log('🎯 Service Worker installed');
        if (event.isUpdate) {
          this.updateAvailable = true;
          this.showUpdatePrompt();
        } else {
          this.showInstallSuccess();
        }
      });

      this.wb.addEventListener('waiting', () => {
        console.log('⏳ Service Worker waiting to activate');
        this.updateAvailable = true;
        this.showUpdatePrompt();
      });

      this.wb.addEventListener('controlling', () => {
        console.log('🚀 Service Worker controlling page');
        // Reload to ensure latest assets
        window.location.reload();
      });

      this.wb.addEventListener('activated', (event) => {
        console.log('✅ Service Worker activated');
        if (!event.isUpdate) {
          this.showPWAReady();
        }
      });

      // Register the service worker
      await this.wb.register();
      
      // Check for updates periodically
      this.startUpdateChecker();
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }

  private startUpdateChecker(): void {
    // Check for updates every 5 minutes
    setInterval(() => {
      if (this.wb) {
        this.wb.update();
      }
    }, 5 * 60 * 1000);

    // Check for updates on page focus
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.wb) {
        this.wb.update();
      }
    });
  }

  private showUpdatePrompt(): void {
    // Create elegant update notification
    const notification = this.createNotification(
      '🚀 App Update Available',
      'A new version is ready! Click to update.',
      [
        {
          text: 'Update Now',
          action: () => this.applyUpdate(),
          primary: true
        },
        {
          text: 'Later',
          action: () => this.dismissNotification(notification),
          primary: false
        }
      ]
    );
  }

  private showInstallSuccess(): void {
    const notification = this.createNotification(
      '🎭 FestiWise is ready!',
      'App installed successfully. Now works offline!',
      [
        {
          text: 'Great!',
          action: () => this.dismissNotification(notification),
          primary: true
        }
      ]
    );

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      this.dismissNotification(notification);
    }, 5000);
  }

  private showPWAReady(): void {
    // Show install prompt for PWA
    this.showInstallPrompt();
  }

  private async applyUpdate(): Promise<void> {
    if (!this.wb) return;

    // Tell waiting service worker to skip waiting
    this.wb.messageSW({
      type: 'SKIP_WAITING'
    });
  }

  private createNotification(
    title: string, 
    message: string, 
    actions: Array<{text: string, action: () => void, primary: boolean}>
  ): HTMLElement {
    // Remove existing notifications
    const existing = document.querySelectorAll('.sw-notification');
    existing.forEach(el => el.remove());

    const notification = document.createElement('div');
    notification.className = 'sw-notification fixed top-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 translate-x-full';
    
    notification.innerHTML = `
      <div class="p-4">
        <div class="flex items-start gap-3">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 text-sm">${title}</h4>
            <p class="text-gray-600 text-sm mt-1">${message}</p>
            <div class="flex gap-2 mt-3">
              ${actions.map(action => `
                <button 
                  class="sw-action px-3 py-1 text-sm rounded ${
                    action.primary 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors"
                  data-action="${action.text}"
                >
                  ${action.text}
                </button>
              `).join('')}
            </div>
          </div>
          <button class="sw-close text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    actions.forEach(action => {
      const button = notification.querySelector(`[data-action="${action.text}"]`);
      if (button) {
        button.addEventListener('click', action.action);
      }
    });

    notification.querySelector('.sw-close')?.addEventListener('click', () => {
      this.dismissNotification(notification);
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.remove('translate-x-full');
    });

    return notification;
  }

  private dismissNotification(notification: HTMLElement): void {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }

  private showInstallPrompt(): void {
    // PWA install prompt will be handled by browser
    // We can enhance this with custom UI later
  }

  // Public methods for manual control
  async forceUpdate(): Promise<void> {
    if (this.wb) {
      await this.wb.update();
    }
  }

  async getCacheStats(): Promise<Record<string, number>> {
    if (!this.wb) return {};
    
    try {
      // Simple approach - cache stats will be logged to console
      // and can be manually inspected for now
      this.wb.messageSW({
        type: 'GET_CACHE_STATS'
      });

      // Return empty for now - can be enhanced later
      return {};
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {};
    }
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }
}

// Singleton instance
const swManager = new ServiceWorkerManager();

export default swManager;
