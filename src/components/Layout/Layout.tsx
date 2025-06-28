import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col transition-colors duration-200">
      <Header />
      <main className="flex-1 pb-20 px-4 pt-6">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;