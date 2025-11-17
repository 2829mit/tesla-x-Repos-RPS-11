import React from 'react';

const navItems = [
  'Solutions', 'Resources', 'Enterprise', 'About Us'
];

const Header: React.FC = () => {
  return (
    <header className="bg-white sticky top-0 z-20 h-[72px] shadow">
      <div className="px-6 md:px-10 h-full">
        <div className="relative flex items-center justify-between h-full">
          {/* Left section: Navigation */}
          <div>
            <nav>
              <div className="flex items-center text-sm font-semibold text-gray-600 tracking-wider space-x-8">
                {navItems.map(item => (
                  <a href="#" key={item} className="py-2 hover:text-gray-900 transition-colors">
                    {item.toUpperCase()}
                  </a>
                ))}
              </div>
            </nav>
          </div>
          
          {/* Center section: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src="https://i.postimg.cc/52fvQyLD/Repos-New-Logo-V1-1.png"
              alt="Repos logo"
              className="h-9 w-auto opacity-60"
            />
          </div>
          
          {/* Right section: Builds Button */}
          <div>
            <button className="flex items-center space-x-2 text-gray-800 font-semibold text-sm tracking-wider hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"></path>
              </svg>
              <span>Book Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;