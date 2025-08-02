// PWA utility functions

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  platform: 'android' | 'ios' | 'desktop' | 'unknown';
  promptShown: boolean;
}

// Detect if the app can be installed
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if running in standalone mode (already installed)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return false;
  }
  
  // Check for beforeinstallprompt support (Android/Chrome)
  return 'onbeforeinstallprompt' in window;
}

// Detect if the app is already installed
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// Detect platform
export function detectPlatform(): 'android' | 'ios' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if (/android/.test(userAgent)) {
    return 'android';
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  } else if (/windows|macintosh|linux/.test(userAgent)) {
    return 'desktop';
  }
  
  return 'unknown';
}

// Get installation state
export function getPWAInstallState(): PWAInstallState {
  return {
    canInstall: canInstallPWA(),
    isInstalled: isPWAInstalled(),
    platform: detectPlatform(),
    promptShown: false, // This would be managed by component state
  };
}

// Check if service worker is supported
export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Check for app updates
export async function checkForUpdates(): Promise<boolean> {
  if (!isServiceWorkerSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return registration.waiting !== null;
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
  
  return false;
}

// Apply app update
export function applyUpdate(): void {
  if (!isServiceWorkerSupported()) return;

  navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  });
}