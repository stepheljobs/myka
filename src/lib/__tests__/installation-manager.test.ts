/**
 * @jest-environment jsdom
 */

import { getInstallationManager } from '../installation-manager';
import { PWAInstallState } from '../pwa-utils';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('InstallationManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with correct default state', () => {
    const manager = getInstallationManager();
    
    expect(manager.isInstalled).toBe(false);
    expect(manager.promptShown).toBe(false);
    expect(manager.platform).toBe('unknown');
  });

  it('should detect platform correctly', () => {
    // Mock Android user agent
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
    });

    const manager = getInstallationManager();
    expect(manager.platform).toBe('android');
  });

  it('should track installation state', () => {
    const manager = getInstallationManager();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    manager.trackInstallationState();
    
    expect(consoleSpy).toHaveBeenCalledWith('PWA Installation State:', expect.any(Object));
    consoleSpy.mockRestore();
  });

  it('should handle state changes', () => {
    const manager = getInstallationManager();
    let stateChangeCallCount = 0;
    let lastState: PWAInstallState | null = null;

    manager.onStateChange = (state: PWAInstallState) => {
      stateChangeCallCount++;
      lastState = state;
    };

    // Simulate app installed event
    const event = new Event('appinstalled');
    window.dispatchEvent(event);

    expect(stateChangeCallCount).toBeGreaterThan(0);
    expect(lastState).toBeTruthy();
  });

  it('should reset prompt state', () => {
    const manager = getInstallationManager();
    
    manager.resetPromptState();
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('pwa-prompt-shown');
    expect(manager.promptShown).toBe(false);
  });

  it('should determine when to show prompt', () => {
    const manager = getInstallationManager();
    
    // Should not show if already installed
    Object.defineProperty(manager, '_isInstalled', { value: true, writable: true });
    expect(manager.shouldShowPrompt()).toBe(false);
    
    // Should not show if prompt already shown
    Object.defineProperty(manager, '_isInstalled', { value: false, writable: true });
    Object.defineProperty(manager, '_promptShown', { value: true, writable: true });
    expect(manager.shouldShowPrompt()).toBe(false);
  });

  it('should handle install prompt for Android', async () => {
    const manager = getInstallationManager();
    
    // Mock beforeinstallprompt event
    const mockPrompt = {
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
    };
    
    Object.defineProperty(manager, 'deferredPrompt', { value: mockPrompt, writable: true });
    Object.defineProperty(manager, '_platform', { value: 'android', writable: true });
    
    await manager.showInstallPrompt();
    
    expect(mockPrompt.prompt).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('pwa-prompt-shown', 'true');
  });
});