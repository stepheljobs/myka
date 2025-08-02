import { BeforeInstallPromptEvent, PWAInstallState, detectPlatform, isPWAInstalled } from './pwa-utils';

export interface InstallationManager {
  canInstall: boolean;
  isInstalled: boolean;
  platform: 'android' | 'ios' | 'desktop' | 'unknown';
  promptShown: boolean;
  showInstallPrompt(): Promise<void>;
  handleInstallEvent(): void;
  trackInstallationState(): void;
  onStateChange: (state: PWAInstallState) => void;
}

class PWAInstallationManager implements InstallationManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private _canInstall = false;
  private _isInstalled = false;
  private _platform: 'android' | 'ios' | 'desktop' | 'unknown' = 'unknown';
  private _promptShown = false;
  private stateChangeCallback: ((state: PWAInstallState) => void) | null = null;

  constructor() {
    this.initialize();
  }

  get canInstall(): boolean {
    return this._canInstall;
  }

  get isInstalled(): boolean {
    return this._isInstalled;
  }

  get platform(): 'android' | 'ios' | 'desktop' | 'unknown' {
    return this._platform;
  }

  get promptShown(): boolean {
    return this._promptShown;
  }

  set onStateChange(callback: (state: PWAInstallState) => void) {
    this.stateChangeCallback = callback;
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    this._platform = detectPlatform();
    this._isInstalled = isPWAInstalled();
    
    // Load prompt shown state from localStorage
    this._promptShown = localStorage.getItem('pwa-prompt-shown') === 'true';

    this.setupEventListeners();
    this.updateCanInstall();
    this.notifyStateChange();
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Listen for beforeinstallprompt event (Android/Chrome)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this._canInstall = true;
      this.notifyStateChange();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this._isInstalled = true;
      this._canInstall = false;
      this.deferredPrompt = null;
      this.notifyStateChange();
    });

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', (e) => {
      this._isInstalled = e.matches;
      if (this._isInstalled) {
        this._canInstall = false;
      }
      this.notifyStateChange();
    });
  }

  private updateCanInstall(): void {
    if (this._isInstalled) {
      this._canInstall = false;
      return;
    }

    // For Android/Chrome, check if we have a deferred prompt
    if (this._platform === 'android' || this._platform === 'desktop') {
      this._canInstall = this.deferredPrompt !== null || 'onbeforeinstallprompt' in window;
    }
    
    // For iOS, we can always show instructions if not installed
    if (this._platform === 'ios') {
      this._canInstall = !this._isInstalled;
    }
  }

  async showInstallPrompt(): Promise<void> {
    if (this._isInstalled || this._promptShown) {
      return;
    }

    this._promptShown = true;
    localStorage.setItem('pwa-prompt-shown', 'true');

    if (this._platform === 'android' && this.deferredPrompt) {
      try {
        await this.deferredPrompt.prompt();
        const choiceResult = await this.deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        this.deferredPrompt = null;
        this._canInstall = false;
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
    }

    this.notifyStateChange();
  }

  handleInstallEvent(): void {
    this._isInstalled = true;
    this._canInstall = false;
    this.deferredPrompt = null;
    this.notifyStateChange();
  }

  trackInstallationState(): void {
    // Track installation analytics or metrics here
    const state = this.getState();
    console.log('PWA Installation State:', state);
    
    // You could send this to analytics service
    // analytics.track('pwa_installation_state', state);
  }

  private getState(): PWAInstallState {
    return {
      canInstall: this._canInstall,
      isInstalled: this._isInstalled,
      platform: this._platform,
      promptShown: this._promptShown,
    };
  }

  private notifyStateChange(): void {
    if (this.stateChangeCallback) {
      this.stateChangeCallback(this.getState());
    }
  }

  // Reset prompt shown state (useful for testing or admin purposes)
  resetPromptState(): void {
    this._promptShown = false;
    localStorage.removeItem('pwa-prompt-shown');
    this.updateCanInstall();
    this.notifyStateChange();
  }

  // Check if we should show the prompt based on user behavior
  shouldShowPrompt(): boolean {
    if (this._isInstalled || this._promptShown || !this._canInstall) {
      return false;
    }

    // Add additional logic here, such as:
    // - User has visited multiple times
    // - User has spent enough time on the site
    // - User has performed certain actions
    
    return true;
  }
}

// Singleton instance
let installationManager: PWAInstallationManager | null = null;

export function getInstallationManager(): PWAInstallationManager {
  if (!installationManager) {
    installationManager = new PWAInstallationManager();
  }
  return installationManager;
}

export default PWAInstallationManager;