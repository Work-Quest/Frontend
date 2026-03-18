import React from 'react';
import { Badge } from "@/components/ui/8bit/badge"; 
import { ENTITY_CONFIG } from '@/config/battleConfig';

interface SpriteProps {
  type: 'characters' | 'bosses';
  id: string;
  action: string;
  positionStyle: React.CSSProperties;
  isMirrored?: boolean;
  name?: string; 
  showBuffRing?: boolean;
}

export const SpriteEntity: React.FC<SpriteProps> = ({ 
  type, 
  id, 
  action, 
  positionStyle, 
  isMirrored,
  name,
  showBuffRing,
}) => {
  const imgSrc = `/assets/sprites/${type}/${id}/${action}.gif`;
  const magicRingSrc = `/assets/magic_ring.gif`;

  const entityConfig =
    ENTITY_CONFIG[type as keyof typeof ENTITY_CONFIG] &&
    (ENTITY_CONFIG[type as keyof typeof ENTITY_CONFIG] as Record<string, { size?: { width: number; height: number } }>)[id];

  const width = entityConfig?.size?.width || 64;
  const height = entityConfig?.size?.height || 57;

  const backgroundImage = showBuffRing
    ? `url(${imgSrc}), url(${magicRingSrc})`
    : `url(${imgSrc})`;

  const backgroundPosition = showBuffRing
    ? 'center bottom, center 60%'
    : 'center bottom';

  const backgroundSize = showBuffRing ? '100%, 50%' : '100%';

  return (
    <div
      style={{
        transition: 'left 1s ease-in-out, bottom 1s ease-in-out, transform 0.5s, opacity 0.5s ease-in-out',
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage,
        imageRendering: 'pixelated',
        backgroundRepeat: 'no-repeat',
        backgroundPosition,
        backgroundSize,
        transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)',
        
        ...positionStyle,
      }}
    >
      {name && (
        <div 
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
            style={{ transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          <Badge 
            variant="default" 
            className="scale-35"
          >
            {name}
          </Badge>
        </div>
      )}
    </div>
  );
};