import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Function to decode URL-encoded strings and format labels
  const formatLabel = (str) => {
    const decodedStr = decodeURIComponent(str);
    return decodedStr
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center space-x-2 text-sm font-medium text-gray-600">
      <a
        href="/"
        className="hover:text-gray-900 transition-colors duration-200"
      >
        Home
      </a>
      {pathnames.map((path, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <a
              href={routeTo}
              className={`hover:text-gray-900 transition-colors duration-200 ${
                isLast ? 'text-gray-900 font-semibold' : 'text-gray-600'
              }`}
            >
              {formatLabel(path)}
            </a>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;