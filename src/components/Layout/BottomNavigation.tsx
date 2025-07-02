import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Users, Calendar, DollarSign, Settings } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { to: '/app', icon: Home, label: t('nav.home'), exact: true },
    { to: '/app/customers', icon: Users, label: t('nav.customers') },
    { to: '/app/jobs', icon: Calendar, label: t('nav.jobs') },
    { to: '/app/payments', icon: DollarSign, label: t('nav.payments') },
    { to: '/app/settings', icon: Settings, label: t('nav.settings') },
  ];

  const isActive = (to: string, exact?: boolean) => {
    if (exact) {
      // For Home, only match exact path or dashboard
      return location.pathname === to || location.pathname === '/app/dashboard';
    }
    // For other routes, match if path starts with the route
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 px-2 py-2 z-50 transition-colors duration-200">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors min-w-0 ${
              isActive(to, exact)
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-dark-700'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;