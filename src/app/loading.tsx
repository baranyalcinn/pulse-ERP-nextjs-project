import React from 'react';
import { PulseAnimation } from '@/components/ui/PulseAnimation';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative">
      <div className="relative w-full max-w-md aspect-video">
        <PulseAnimation />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="loading-text text-xl">
              Yükleniyor
            </p>
            <div className="flex justify-center gap-1 mt-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 