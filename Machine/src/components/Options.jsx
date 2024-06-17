import  { useState } from 'react';
import { Link } from 'react-router-dom';

const OptionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false); // State to track dropdown visibility

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle dropdown visibility
  };

  const handleOptionClick = (route) => {
    console.log(`Navigating to ${route}`);
    setIsOpen(false); // Close dropdown after an option is clicked
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative inline-block text-left">
        <div>
          <button
            onClick={handleToggleDropdown}
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            aria-expanded={isOpen ? 'true' : 'false'}
          >
            Options
            <svg
              className={`ml-2 h-5 w-5 ${isOpen ? 'transform rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown panel, conditional rendering based on isOpen state */}
        {isOpen && (
          <div
            className="origin-top absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1">
              <Link to="/page1">
                <button
                  onClick={() => handleOptionClick('/page1')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  Option 1
                </button>
              </Link>
              <Link to="/page2">
                <button
                  onClick={() => handleOptionClick('/page2')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  Option 2
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsDropdown;
