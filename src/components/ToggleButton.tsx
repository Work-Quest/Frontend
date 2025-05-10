import React from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface ToggleButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isVisible, onClick }) => (
  <div className="relative w-full flex justify-center">
    <div className="absolute -top-3 w-full flex flex-col items-center z-10">
      <button
        onClick={onClick}
        className="absolute -top-2 !bg-lightOrange !rounded-full hover:!shadow-md hover:!border-orange transform transition-all duration-300 focus:!outline-none"
        aria-label={isVisible ? "Collapse boss section" : "Expand boss section"}
      >
        {isVisible ? (
          <FaChevronUp className="text-offWhite" />
        ) : (
          <FaChevronDown className="text-offWhite" />
        )}
      </button>
    </div>
  </div>
);

export default ToggleButton;