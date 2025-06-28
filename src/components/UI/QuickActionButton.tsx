import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'p-3 text-sm';
      case 'md':
        return 'p-4 text-base';
      case 'lg':
        return 'p-6 text-lg';
      default:
        return 'p-4 text-base';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center rounded-xl font-semibold
        transition-colors duration-200 shadow-sm hover:shadow-md
        min-h-[44px] touch-manipulation
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
    >
      <Icon size={size === 'lg' ? 28 : size === 'sm' ? 20 : 24} className="mb-2" />
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
};

export default QuickActionButton;