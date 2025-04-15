import React from 'react';

interface BossPlaceholderProps {
  isVisible: boolean;
}

const BossPlaceholder: React.FC<BossPlaceholderProps> = ({ isVisible }) => (
  <div
    className={`overflow-hidden transition-all duration-500 ease-in-out ${
      isVisible ? "h-70" : "h-10"
    }`}
  >
    <div className="h-70 flex-shrink-0 border-b bg-cream border-gray-400 flex items-center justify-center text-gray-500 text-sm">
      Boss Fight Placeholder
    </div>
  </div>
);

export default BossPlaceholder;