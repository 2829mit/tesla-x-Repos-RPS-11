import React, { useEffect, useRef } from 'react';
import Header from './Header';

interface ExplorePageProps {
  onNavigateHome: () => void;
  onNavigateToApp: () => void;
  onFaqClick: () => void;
  onAboutClick: () => void;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigateHome, onNavigateToApp, onFaqClick, onAboutClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.log("Video autoplay failed:", error));
    }
  }, []);

  const handleNavClick = (item: string) => {
    if (item === 'Build Your Own RPS') {
      onNavigateToApp();
    } else if (item === 'About Us') {
      onAboutClick();
    } else if (item === 'Home') {
      onNavigateHome();
    } else if (item === 'FAQs') {
      onFaqClick();
    }
  };

  const safetyFeatures = [
    {
      title: "RFID Technology",
      image: "https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764179277/Screenshot_2025-11-26_231740_jxjxbh.png",
      subtitle: "Automated Asset Identification",
      desc: "Secure, contactless fueling authorisation. Our RFID system ensures fuel is dispensed only to authorized vehicles, eliminating pilferage and manual data entry errors."
    },
    {
      title: "Fire Suppression",
      image: "https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764218815/Screenshot_2025-11-27_101642_ry3ctu.png",
      subtitle: "Automatic Activation System",
      desc: "Instant response safety mechanism. Detects thermal anomalies and deploys suppression agents automatically, protecting personnel and assets before a hazard escalates."
    },
    {
      title: "Leak Detection",
      image: "https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764177461/Screenshot_2025-11-26_224724_kbhepo.png",
      subtitle: "Real-time Integrity Monitoring",
      desc: "Precision sensors monitor double-walled tank integrity 24/7. Any breach triggers an immediate system lockdown and notifies the central command center instantly."
    },
    {
      title: "Real-time Monitoring",
      image: "https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764179661/WhatsApp_Image_2025-11-26_at_23.22.47_c4c6675e_h8ft3i.jpg",
      subtitle: "Cloud Connectivity",
      desc: "Complete visibility of your fuel ecosystem. Track inventory levels, dispensing patterns, and machine health from anywhere in the world via the Repos OS dashboard."
    }
  ];

  const complianceItems = [
    { 
      name: "PESO", 
      desc: "Petroleum & Explosives Safety",
      image: "https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764305823/peso_hjsbio.jpg"
    },
    { 
      name: "L&M", 
      desc: "Legal Metrology Standards",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png"
    },
    { 
      name: "CIMFR", 
      desc: "Mining & Fuel Research",
      image: "https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764305823/cimfr_mtz29w.jpg"
    },
    { 
      name: "BIS", 
      desc: "Bureau of Indian Standards",
      image: "https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764305823/bis_krvdyv.png"
    },
    { 
      name: "ATEX", 
      desc: "Explosive Atmospheres",
      image: "https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764305822/atex_dis8a4.png"
    }
  ];

  const carouselItems = [...complianceItems, ...complianceItems, ...complianceItems];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      <Header 
        navItems={['Home', 'About Us', 'Build Your Own RPS']}
        rightNavItems={['FAQs']}
        onNavItemClick={handleNavClick}
        onHomeClick={onNavigateHome}
        showRoi={false}
      />
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .text-outline {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
          color: transparent;
        }
      `}</style>

      {/* Hero Video */}
      <div className="relative h-screen w-full overflow-hidden">
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 animate-fade-in">
          <p className="text-gray-400 tracking-[0.5em] uppercase text-xs md:text-sm font-semibold mb-8 animate-fade-in">
            The New Standard
          </p>
          <h1 className="text-6xl md:text-9xl font-medium tracking-tighter uppercase mb-8 text-white mix-blend-overlay opacity-90 drop-shadow-2xl">
            Future Ready
          </h1>
          <div className="h-[1px] w-24 bg-white/50 mb-8"></div>
          <p className="text-gray-300 tracking-[0.3em] uppercase text-xs md:text-sm font-medium max-w-md leading-relaxed">
            Intelligent Energy Distribution Ecosystem
          </p>
          <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-70 animate-bounce">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="bg-zinc-50 text-black py-32 md:py-48 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-8">
                <h2 className="text-5xl md:text-8xl font-light leading-[0.9] tracking-tighter mb-8 text-[#111]">
                  Leveraging <br/>
                  <span className="font-semibold">future technologies.</span>
                </h2>
                <h2 className="text-4xl md:text-7xl font-light leading-tight tracking-tighter text-gray-400">
                  Revolutionising the industry.
                </h2>
             </div>
             <div className="lg:col-span-4 flex flex-col justify-end h-full pt-4">
                <div className="border-t border-black pt-6">
                  <p className="text-[#333] text-lg leading-relaxed font-light">
                    We integrate military-grade sensors with advanced edge computing to create a seamless, 
                    automated energy ecosystem. Experience <span className="font-semibold">100% quantity assurance</span> and zero-loss delivery.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-32 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl md:text-7xl font-bold text-black mb-12 tracking-tighter">Ready to Innovate?</h2>
        <button 
          onClick={onNavigateToApp}
          className="group relative overflow-hidden bg-black text-white px-16 py-6 text-sm font-bold uppercase tracking-[0.25em] transition-all hover:scale-105"
        >
          <span className="relative z-10 group-hover:text-white transition-colors">Build Your Own RPS</span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-500 group-hover:scale-150 group-hover:bg-zinc-800"></div>
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;