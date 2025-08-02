'use client';

import { useState, useEffect } from 'react';
import { getInstallationManager } from '@/lib/installation-manager';
import { PWAInstallState } from '@/lib/pwa-utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface IOSInstallInstructionsProps {
  onClose?: () => void;
  className?: string;
}

export function IOSInstallInstructions({ onClose, className = '' }: IOSInstallInstructionsProps) {
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
    setIsVisible(manager.shouldShowPrompt() && initialState.platform === 'ios');

    // Listen for state changes
    manager.onStateChange = (state: PWAInstallState) => {
      setInstallState(state);
      setIsVisible(manager.shouldShowPrompt() && state.platform === 'ios');
    };

    return () => {
      manager.onStateChange = () => {};
    };
  }, []);

  const handleClose = () => {
    const manager = getInstallationManager();
    // Mark prompt as shown for iOS
    manager.showInstallPrompt();
    setIsVisible(false);
    onClose?.();
  };

  const handleGotIt = () => {
    handleClose();
  };

  if (!isVisible || installState.isInstalled || installState.platform !== 'ios') {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${className}`}>
      <Card className="max-w-md w-full bg-white border-4 border-black shadow-brutal max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-400 border-4 border-black mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-black mb-2">
              Install MYKA on iOS
            </h2>
            <p className="text-gray-700 font-bold">
              Add MYKA to your home screen for instant access to your fitness journey!
            </p>
          </div>

          <div className="space-y-6 mb-6">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0">
                <span className="text-black font-black text-sm">1</span>
              </div>
              <div>
                <p className="font-bold text-black mb-2">
                  Tap the Share button
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-bold">
                    (Usually at the bottom of Safari)
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0">
                <span className="text-black font-black text-sm">2</span>
              </div>
              <div>
                <p className="font-bold text-black mb-2">
                  Select &quot;Add to Home Screen&quot;
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-600 font-bold">
                    Look for this icon in the share menu
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0">
                <span className="text-black font-black text-sm">3</span>
              </div>
              <div>
                <p className="font-bold text-black mb-2">
                  Tap &quot;Add&quot; to confirm
                </p>
                <p className="text-gray-600 font-bold text-sm">
                  MYKA will appear on your home screen for instant fitness tracking!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-100 border-4 border-black p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 border-2 border-black flex items-center justify-center">
                <span className="text-black font-black text-sm">✓</span>
              </div>
              <div>
                <p className="font-bold text-black text-sm">Fitness Benefits:</p>
                <p className="text-gray-700 font-bold text-sm">
                  Track workouts offline • Log meals instantly • Monitor progress anywhere
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleGotIt}
              variant="default"
              size="lg"
              className="flex-1"
            >
              Got it!
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

export default IOSInstallInstructions;