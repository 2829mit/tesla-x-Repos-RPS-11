
import React from 'react';

const navItems = [
  'Solutions', 'Resources', 'Enterprise', 'About Us'
];

interface HeaderProps {
  onRoiClick: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRoiClick, onHomeClick }) => {
  return (
    <header className="bg-white sticky top-0 z-20 h-[72px] shadow">
      <div className="px-6 md:px-10 h-full">
        <div className="relative flex items-center justify-between h-full">
          {/* Left section: Navigation */}
          <div>
            <nav>
              <div className="hidden md:flex items-center text-sm font-semibold text-gray-600 tracking-wider space-x-8">
                {navItems.map(item => (
                  <button 
                    key={item} 
                    onClick={onHomeClick}
                    className="py-2 hover:text-gray-900 transition-colors uppercase bg-transparent border-none cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </nav>
          </div>
          
          {/* Center section: Logo */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={onHomeClick}
          >
            <img
              src="https://i.postimg.cc/52fvQyLD/Repos-New-Logo-V1-1.png"
              alt="Repos logo"
              className="h-9 w-auto opacity-60"
            />
          </div>
          
          {/* Right section: ROI Calculator Button */}
          <div>
            <button 
              onClick={onRoiClick}
              className="flex items-center space-x-2 text-gray-800 font-semibold text-sm tracking-wider hover:text-black transition-colors bg-transparent border-none cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">ROI Calculator</span>
              <span className="sm:hidden">ROI</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
