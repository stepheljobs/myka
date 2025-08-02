'use client';

import { useState, useEffect } from 'react';
import { Badge } from './badge';
import { Wifi, WifiOff } from 'lucide-react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus && isOnline) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      showStatus ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium shadow-lg"
      >
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            Back Online!
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            Offline Mode
          </>
        )}
      </Badge>
    </div>
  );
}