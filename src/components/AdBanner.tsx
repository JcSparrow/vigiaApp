import React, { useEffect, useRef } from 'react';
import { DollarSign } from 'lucide-react';

interface AdBannerProps {
  size: 'small' | 'medium' | 'large';
  position: 'top' | 'sidebar' | 'content' | 'footer';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner({ size, position, className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  // Ad size configurations based on standard AdSense formats
  const adSizes = {
    small: {
      height: 'h-[90px]',
      width: 'w-full',
      adSlot: '1234567890', // Replace with actual ad slot ID
      format: 'horizontal'
    },
    medium: {
      height: 'h-[250px]',
      width: 'w-full',
      adSlot: '0987654321', // Replace with actual ad slot ID
      format: 'rectangle'
    },
    large: {
      height: 'h-[600px]',
      width: 'w-full md:w-[300px]',
      adSlot: '1122334455', // Replace with actual ad slot ID
      format: 'vertical'
    }
  };

  // Position-specific styles
  const adPositions = {
    top: 'mx-auto max-w-[728px]',
    sidebar: 'w-full md:w-[300px]',
    content: 'mx-auto max-w-[728px]',
    footer: 'mx-auto max-w-[728px]'
  };

  useEffect(() => {
    // Only try to load ads if not in development
    if (process.env.NODE_ENV === 'production') {
      try {
        if (adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    }
  }, []);

  return (
    <div 
      className={`relative overflow-hidden ${adSizes[size].height} ${adPositions[position]} ${className}`}
      style={{ minHeight: '100px' }}
    >
      {process.env.NODE_ENV === 'production' ? (
        <ins
          className="adsbygoogle block w-full h-full"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your publisher ID
          data-ad-slot={adSizes[size].adSlot}
          data-ad-format={adSizes[size].format}
          data-full-width-responsive="true"
        />
      ) : (
        // Development placeholder
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <DollarSign className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">Espaço Publicitário</span>
            <span className="block text-xs mt-1">({size} - {position})</span>
          </div>
        </div>
      )}
    </div>
  );
}