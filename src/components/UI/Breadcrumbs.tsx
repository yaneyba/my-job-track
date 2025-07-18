import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-2 flex-shrink-0 transition-colors duration-200" />
            )}
            
            {item.current ? (
              <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px] transition-colors duration-200">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium flex items-center"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                <span className="truncate max-w-[150px]">{item.label}</span>
              </Link>
            ) : (
              <span className="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-200">
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                <span className="truncate max-w-[150px]">{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;