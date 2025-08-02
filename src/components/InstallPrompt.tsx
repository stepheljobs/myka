'use client';

import { useState, useEffect } from 'react';
import { getInstallationManager } from '@/lib/installation-manager';
import { PWAInstallState } from '@/lib/pwa-utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface InstallPromptProps {
  onClose?: () => void;
  className?: string;
}

export function InstallPrompt({ onClose, className = '' }: InstallPromptProps) {
  const [installState, setInstallState] = useState<PWAInstallState>({
    canInstall: false,
    isInstalled: false,
    platform: 'unknown',
    promptShown: false,
  });
  const [isVisible, setIsVisible] = useState(false);

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
    setIsVisible(manager.shouldShowPrompt());

    // Listen for state changes
    manager.onStateChange = (state: PWAInstallState) => {
      setInstallState(state);
      setIsVisible(manager.shouldShowPrompt());
    };

    return () => {
      manager.onStateChange = () => {};
    };
  }, []);

  const handleInstall = async () => {
    const manager = getInstallationManager();
    await manager.showInstallPrompt();
    setIsVisible(false);
    onClose?.();
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible || installState.isInstalled || installState.platform !== 'android') {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${className}`}>
      <Card className="max-w-md w-full bg-white border-4 border-black shadow-brutal">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-400 border-4 border-black mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-black mb-2">
              Install MYKA on Your Home Screen!
            </h2>
            <p className="text-gray-700 font-bold">
              Keep your fitness journey at your fingertips. Install MYKA for instant access to track your progress, log workouts, and stay motivated - even offline.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 border-2 border-black flex items-center justify-center">
                <span className="text-black font-black text-sm">✓</span>
              </div>
              <span className="font-bold text-black">Track fitness offline</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 border-2 border-black flex items-center justify-center">
                <span className="text-black font-black text-sm">✓</span>
              </div>
              <span className="font-bold text-black">Instant workout logging</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 border-2 border-black flex items-center justify-center">
                <span className="text-black font-black text-sm">✓</span>
              </div>
              <span className="font-bold text-black">Quick progress updates</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleInstall}
              variant="default"
              size="lg"
              className="flex-1"
            >
              Install MYKA
            </Button>
            <Button
              onClick={handleClose}
              variant="secondary"
              size="lg"
              className="px-6"
            >
              Later
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default InstallPrompt;