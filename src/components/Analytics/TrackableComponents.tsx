import React, { ReactNode } from 'react';
import { useAnalytics } from '@/contexts/AnalyticsContext';

interface TrackableButtonProps {
  onClick: () => void;
  trackingEvent: string;
  trackingProperties?: Record<string, any>;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * A button component that automatically tracks click events for analytics.
 * Wraps the onClick handler to include analytics tracking.
 */
export const TrackableButton: React.FC<TrackableButtonProps> = ({
  onClick,
  trackingEvent,
  trackingProperties = {},
  children,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    // Track the event first
    trackEvent(trackingEvent, {
      button_text: typeof children === 'string' ? children : 'button_clicked',
      button_disabled: disabled,
      ...trackingProperties,
    });

    // Then execute the original onClick
    onClick();
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface TrackableLinkProps {
  onClick?: () => void;
  href?: string;
  trackingEvent: string;
  trackingProperties?: Record<string, any>;
  children: ReactNode;
  className?: string;
  target?: string;
}

/**
 * A link component that automatically tracks click events for analytics.
 */
export const TrackableLink: React.FC<TrackableLinkProps> = ({
  onClick,
  href,
  trackingEvent,
  trackingProperties = {},
  children,
  className = '',
  target,
}) => {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    // Track the event first
    trackEvent(trackingEvent, {
      link_text: typeof children === 'string' ? children : 'link_clicked',
      link_href: href,
      link_target: target,
      ...trackingProperties,
    });

    // Then execute the original onClick if provided
    if (onClick) {
      onClick();
    }
  };

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={className}
        target={target}
      >
        {children}
      </a>
    );
  }

  return (
    <span
      onClick={handleClick}
      className={className}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {children}
    </span>
  );
};

export default TrackableButton;
