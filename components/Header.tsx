
import React, { useState } from 'react';

const DEFAULT_NAV_ITEMS = [
  'About Us', 'UseCase', 'Gallery', 'Repos Pay'
];

interface HeaderProps {
  onRoiClick?: () => void;
  onHomeClick?: () => void;
  navItems?: string[];
  rightNavItems?: string[];
  onNavItemClick?: (item: string) => void;
  showRoi?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onRoiClick, 
  onHomeClick, 
  navItems = DEFAULT_NAV_ITEMS,
  rightNavItems = [],
  onNavItemClick,
  showRoi = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (item: string) => {
    setIsMobileMenuOpen(false);
    if (onNavItemClick) {
      onNavItemClick(item);
    } else if (onHomeClick) {
      onHomeClick();
    }
  };

  const handleRoiClick = () => {
    setIsMobileMenuOpen(false);
    if (onRoiClick) onRoiClick();
  };

  return (
    <>
      <header className="bg-white fixed top-0 left-0 right-0 z-50 h-[72px] shadow-sm w-full">
        <div className="px-6 md:px-10 h-full">
          <div className="relative flex items-center justify-between h-full">
            
            {/* Left section: Main Desktop Navigation */}
            {/* Changed breakpoint to xl to prevent overlap on tablets/small laptops */}
            <div className="flex items-center">
              <nav className="hidden xl:flex items-center font-semibold text-gray-600 tracking-wider space-x-4 2xl:space-x-8 text-xs 2xl:text-sm">
                {navItems.map(item => (
                  <button 
                    key={item} 
                    onClick={() => handleNavClick(item)}
                    className="py-2 hover:text-black transition-colors uppercase bg-transparent border-none cursor-pointer whitespace-nowrap"
                  >
                    {item}
                  </button>
                ))}
                
                {/* ROI Calculator Button (Desktop) */}
                {showRoi && onRoiClick && (
                  <button 
                    onClick={onRoiClick}
                    className="flex items-center space-x-2 text-gray-800 font-semibold tracking-wider hover:text-black transition-colors bg-transparent border-none cursor-pointer uppercase whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>ROI Calculator</span>
                  </button>
                )}
              </nav>
            </div>
            
            {/* Center section: Logo */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              onClick={onHomeClick}
            >
              <img
                src="https://i.postimg.cc/52fvQyLD/Repos-New-Logo-V1-1.png"
                alt="Repos logo"
                className="h-7 md:h-9 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
            
            {/* Right section: Desktop Right Nav & Mobile Controls */}
            <div className="flex items-center justify-end">
              
              {/* Desktop Right Nav (e.g. FAQs) */}
              {/* Changed breakpoint to xl */}
              <div className="hidden xl:flex items-center space-x-6 2xl:space-x-8 font-semibold text-gray-600 tracking-wider text-xs 2xl:text-sm">
                  {rightNavItems.map(item => (
                    <button 
                      key={item} 
                      onClick={() => handleNavClick(item)}
                      className="py-2 hover:text-black transition-colors uppercase bg-transparent border-none cursor-pointer whitespace-nowrap"
                    >
                      {item}
                    </button>
                  ))}
              </div>

              {/* Mobile Menu Button (Hamburger) - Visible below xl */}
              <div className="xl:hidden flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-gray-600 hover:text-black focus:outline-none"
                  aria-label="Open Menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content overlap since header is fixed */}
      <div className="h-[72px]" />

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } xl:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-gray-100">
             <span className="text-lg font-bold text-gray-900 uppercase tracking-widest">Menu</span>
             <button 
               onClick={() => setIsMobileMenuOpen(false)}
               className="p-2 text-gray-600 hover:text-black"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex-1 overflow-y-auto py-8 px-6">
             <nav className="flex flex-col space-y-6">
                {navItems.map(item => (
                  <button 
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className="text-left text-xl font-medium text-gray-800 hover:text-blue-600 transition-colors uppercase tracking-wide"
                  >
                    {item}
                  </button>
                ))}

                {/* Right Nav Items on Mobile */}
                {rightNavItems.map(item => (
                   <button 
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className="text-left text-xl font-medium text-gray-800 hover:text-blue-600 transition-colors uppercase tracking-wide"
                  >
                    {item}
                  </button>
                ))}

                {showRoi && onRoiClick && (
                  <button 
                    onClick={handleRoiClick}
                    className="flex items-center space-x-3 text-xl font-medium text-gray-800 hover:text-blue-600 transition-colors uppercase tracking-wide pt-4 border-t border-gray-100"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>ROI Calculator</span>
                  </button>
                )}
             </nav>
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-100">
             <p className="text-xs text-gray-400 text-center">© 2024 Repos Energy India Pvt Ltd.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
