import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  /** Size variant for the logo */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Layout variant */
  variant?: 'icon-only' | 'horizontal' | 'stacked';
  /** Color theme */
  theme?: 'light' | 'dark' | 'colored' | 'white';
  /** Whether the logo should be clickable (links to home) */
  clickable?: boolean;
  /** Custom click handler (overrides default navigation) */
  onClick?: () => void;
  /** Custom CSS classes */
  className?: string;
  /** Whether to show the tagline */
  showTagline?: boolean;
  /** Custom tagline text */
  tagline?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  theme = 'colored',
  clickable = true,
  onClick,
  className = '',
  showTagline = false,
  tagline = 'Simple Job Tracking'
}) => {
  // Size configurations
  const sizeConfig = {
    xs: {
      icon: 'h-4 w-4',
      iconContainer: 'p-1',
      title: 'text-sm font-bold',
      tagline: 'text-xs',
      spacing: 'space-x-1',
      stackSpacing: 'space-y-0.5'
    },
    sm: {
      icon: 'h-5 w-5',
      iconContainer: 'p-1.5',
      title: 'text-base font-bold',
      tagline: 'text-xs',
      spacing: 'space-x-2',
      stackSpacing: 'space-y-1'
    },
    md: {
      icon: 'h-6 w-6',
      iconContainer: 'p-2',
      title: 'text-lg font-bold',
      tagline: 'text-sm',
      spacing: 'space-x-3',
      stackSpacing: 'space-y-1'
    },
    lg: {
      icon: 'h-8 w-8',
      iconContainer: 'p-3',
      title: 'text-xl font-bold',
      tagline: 'text-sm',
      spacing: 'space-x-4',
      stackSpacing: 'space-y-2'
    },
    xl: {
      icon: 'h-10 w-10',
      iconContainer: 'p-4',
      title: 'text-2xl font-bold',
      tagline: 'text-base',
      spacing: 'space-x-4',
      stackSpacing: 'space-y-2'
    }
  };

  // Theme configurations
  const themeConfig = {
    light: {
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-700',
      titleColor: 'text-gray-900',
      taglineColor: 'text-gray-600'
    },
    dark: {
      iconBg: 'bg-gray-800',
      iconColor: 'text-gray-300',
      titleColor: 'text-gray-100',
      taglineColor: 'text-gray-400'
    },
    colored: {
      iconBg: 'bg-gradient-to-r from-blue-600 to-purple-600',
      iconColor: 'text-white',
      titleColor: 'text-gray-900 dark:text-white',
      taglineColor: 'text-gray-600 dark:text-gray-400'
    },
    white: {
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      titleColor: 'text-white',
      taglineColor: 'text-white/80'
    }
  };

  const config = sizeConfig[size];
  const colors = themeConfig[theme];

  // Icon component
  const IconComponent = () => (
    <div className={`${colors.iconBg} ${config.iconContainer} rounded-lg`}>
      <img 
        src="/icon.svg"
        alt="MyJobTrack Logo" 
        className={`${config.icon}`}
      />
    </div>
  );

  // Text component
  const TextComponent = () => (
    <div className={variant === 'stacked' ? 'text-center' : ''}>
      <h1 className={`${config.title} ${colors.titleColor}`}>
        MyJobTrack
      </h1>
      {showTagline && (
        <p className={`${config.tagline} ${colors.taglineColor}`}>
          {tagline}
        </p>
      )}
    </div>
  );

  // Logo content based on variant
  const LogoContent = () => {
    switch (variant) {
      case 'icon-only':
        return <IconComponent />;
      
      case 'horizontal':
        return (
          <div className={`flex items-center ${config.spacing}`}>
            <IconComponent />
            <TextComponent />
          </div>
        );
      
      case 'stacked':
        return (
          <div className={`flex flex-col items-center ${config.stackSpacing}`}>
            <IconComponent />
            <TextComponent />
          </div>
        );
      
      default:
        return null;
    }
  };

  // Wrapper component (clickable or static)
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const baseClasses = `inline-flex transition-opacity duration-200 ${className}`;
    
    if (onClick) {
      return (
        <button
          onClick={onClick}
          className={`${baseClasses} hover:opacity-80 cursor-pointer`}
        >
          {children}
        </button>
      );
    }
    
    if (clickable) {
      return (
        <Link
          to="/"
          className={`${baseClasses} hover:opacity-80 cursor-pointer`}
        >
          {children}
        </Link>
      );
    }
    
    return (
      <div className={baseClasses}>
        {children}
      </div>
    );
  };

  return (
    <Wrapper>
      <LogoContent />
    </Wrapper>
  );
};

export default Logo;
