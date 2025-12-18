import React from 'react';
import Header from './Header';

interface LandingPageProps {
  onEnterApp: () => void;
  onExploreClick: () => void;
  onRoiClick?: () => void;
  onFaqClick: () => void;
  onReposPayClick: () => void;
  onAboutClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onExploreClick, onRoiClick, onFaqClick, onReposPayClick, onAboutClick }) => {
  const handleNavClick = (item: string) => {
    if (item === 'Build Your Own RPS') {
      onEnterApp();
    } else if (item === 'Explore') {
      onExploreClick();
    } else if (item === 'ROI Calculator' && onRoiClick) {
      onRoiClick();
    } else if (item === 'FAQs') {
      onFaqClick();
    } else if (item === 'Repos Pay') {
      onReposPayClick();
    } else if (item === 'About Us') {
      onAboutClick();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header 
        navItems={['About Us', 'Explore', 'Repos Pay', 'ROI Calculator', 'Build Your Own RPS']}
        rightNavItems={['FAQs']}
        onNavItemClick={handleNavClick}
        onHomeClick={() => {}}
        showRoi={false}
      />
      
      {/* Section 1: Embrace The Impossible (Hero) */}
      <div className="relative h-[calc(100vh-72px)] overflow-hidden bg-black group shrink-0">
        <video 
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-80"
          autoPlay 
          muted 
          loop 
          playsInline
          poster="https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg"
        >
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

      {/* Section 2: Transforming Energy Distribution */}
      <div className="relative h-screen overflow-hidden bg-black shrink-0">
         <video 
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
            autoPlay 
            muted 
            loop 
            playsInline
         >
            <source src="https://res.cloudinary.com/dt8jmqu8d/video/upload/v1764178964/Transforming_Energy_Distribution_through_Repos_Ecosystem_ayqp2x.mp4" type="video/mp4" />
            Your browser does not support the video tag.
         </video>
         
         <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Section 3: Trusted Brands */}
      <div className="bg-white py-24 px-6 flex flex-col items-center text-center">
        <p className="text-xs md:text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">Trusted Partners</p>
        <h2 className="text-3xl md:text-5xl font-bold text-black mb-16 tracking-tight">Powering Industry Leaders</h2>
        <div className="max-w-7xl mx-auto w-full flex justify-center">
          <img 
            src="https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764218439/Screenshot_2025-11-27_100713_olo5at.png" 
            alt="Trusted Brands" 
            className="w-full h-auto max-w-5xl object-contain mix-blend-multiply opacity-90 hover:opacity-100 transition-opacity duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;