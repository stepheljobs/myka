'use client';

import React from 'react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Neobrutalist offline card */}
        <div className="bg-yellow-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
            <h1 className="text-4xl font-black text-black mb-4 transform rotate-1">
              OFFLINE!
            </h1>
            <p className="text-lg font-bold text-black mb-6">
              You&apos;re currently offline, but don&apos;t worry - we&apos;ve got you covered!
            </p>
            <div className="space-y-4">
              <div className="bg-red-400 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-bold text-black text-sm">
                  ⚡ Your data is safely cached
                </p>
              </div>
              <div className="bg-green-400 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-bold text-black text-sm">
                  🔄 We&apos;ll sync when you&apos;re back online
                </p>
              </div>
              <div className="bg-blue-400 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-bold text-black text-sm">
                  📱 Keep using the app normally
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-black text-white font-black py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,107,53,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,107,53,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

