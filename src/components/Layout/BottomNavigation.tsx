import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, DollarSign, Settings } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/app', icon: Home, label: 'Home', exact: true },
    { to: '/app/customers', icon: Users, label: 'Customers' },
    { to: '/app/jobs', icon: Calendar, label: 'Jobs' },
    { to: '/app/payments', icon: DollarSign, label: 'Payments' },
    { to: '/app/settings', icon: Settings, label: 'Settings' },
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors min-w-0 ${
              isActive(to, exact)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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