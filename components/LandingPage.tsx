
import React from 'react';
import Header from './Header';

interface LandingPageProps {
  onEnterApp: () => void;
  onExploreClick: () => void;
  onRoiClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onExploreClick, onRoiClick }) => {
  const handleNavClick = (item: string) => {
    if (item === 'Build Your Own RPS') {
      onEnterApp();
    } else if (item === 'Explore') {
      onExploreClick();
    } else if (item === 'ROI Calculator' && onRoiClick) {
      onRoiClick();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header 
        navItems={['About Us', 'Explore', 'Repos Pay', 'ROI Calculator', 'Build Your Own RPS', 'FAQs']}
        onNavItemClick={handleNavClick}
        onHomeClick={() => {}}
        showRoi={false}
      />
      
      <div className="relative flex-grow h-[calc(100vh-72px)] overflow-hidden bg-black group">
        <video 
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-80"
          autoPlay 
          muted 
          loop 
          playsInline
          poster="https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg"
        >
          {/* Placeholder video source - Abstract Tech/Industrial Flow */}
          <source src="https://videos.pexels.com/video-files/5309381/5309381-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-widest mb-6 uppercase drop-shadow-lg">
            Embrace The Impossible
          </h1>
          <p className="text-lg md:text-xl tracking-[0.2em] mb-12 uppercase font-light drop-shadow-md">
            Energy Distribution Reimagined | Since 2017
          </p>
          
          <button 
            onClick={onEnterApp}
            className="group relative px-10 py-3 md:px-12 md:py-4 border-2 border-white text-white uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            Build Your Own RPS
          </button>
          
          <div className="absolute bottom-10 animate-bounce cursor-pointer" onClick={onExploreClick}>
             <div className="flex flex-col items-center gap-2">
               <span className="text-xs tracking-widest uppercase">Explore</span>
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
