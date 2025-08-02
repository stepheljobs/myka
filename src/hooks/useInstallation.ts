'use client';

import { useState, useEffect, useCallback } from 'react';
import { getInstallationManager } from '@/lib/installation-manager';
import { PWAInstallState } from '@/lib/pwa-utils';

export interface UseInstallationReturn {
  // State
  canInstall: boolean;
  isInstalled: boolean;
  platform: 'android' | 'ios' | 'desktop' | 'unknown';
  promptShown: boolean;
  shouldShowPrompt: boolean;
  
  // Actions
  showInstallPrompt: () => Promise<void>;
  resetPromptState: () => void;
  trackInstallationState: () => void;
}

export function useInstallation(): UseInstallationReturn {
  const [installState, setInstallState] = useState<PWAInstallState>({
    canInstall: false,
    isInstalled: false,
    platform: 'unknown',
    promptShown: false,
  });
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  useEffect(() => {
    const manager = getInstallationManager();
    
    // Set initial state
    const initialState = {
      canInstall: manager.canInstall,
      isInstalled: manager.isInstalled,
      platform: manager.platform,
      promptShown: manager.promptShown,
    };
    setInstallState(initialState);
    setShouldShowPrompt(manager.shouldShowPrompt());

    // Listen for state changes
    manager.onStateChange = (state: PWAInstallState) => {
      setInstallState(state);
      setShouldShowPrompt(manager.shouldShowPrompt());
    };

    // Track initial state
    manager.trackInstallationState();

    return () => {
      manager.onStateChange = () => {};
    };
  }, []);

  const showInstallPrompt = useCallback(async () => {
    const manager = getInstallationManager();
    await manager.showInstallPrompt();
  }, []);

  const resetPromptState = useCallback(() => {
    const manager = getInstallationManager();
    manager.resetPromptState();
  }, []);

  const trackInstallationState = useCallback(() => {
    const manager = getInstallationManager();
    manager.trackInstallationState();
  }, []);

  return {
    // State
    canInstall: installState.canInstall,
    isInstalled: installState.isInstalled,
    platform: installState.platform,
    promptShown: installState.promptShown,
    shouldShowPrompt,
    
    // Actions
    showInstallPrompt,
    resetPromptState,
    trackInstallationState,
  };
}

export default useInstallation;