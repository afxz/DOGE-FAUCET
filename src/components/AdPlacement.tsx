import React from 'react';
import { config } from '../config/settings';

interface AdPlacementProps {
  position: keyof typeof config.ads;
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ position, className = '' }) => {
  return (
    <div 
      className={`ad-container ${className}`}
      dangerouslySetInnerHTML={{ __html: config.ads[position] }}
    />
  );
};