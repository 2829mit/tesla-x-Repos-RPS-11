
import React, { useEffect, useRef } from 'react';
import Header from './Header';

interface ExplorePageProps {
  onNavigateHome: () => void;
  onNavigateToApp: () => void;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigateHome, onNavigateToApp }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays automatically
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.log("Video autoplay failed:", error));
    }
  }, []);

  const handleNavClick = (item: string) => {
    if (item === 'Build Your Own RPS') {
      onNavigateToApp();
    } else if (item === 'About Us' || item === 'Home') {
      onNavigateHome();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-gray-800 selection:text-white">
      <Header 
        navItems={['About Us', 'Explore', 'Build Your Own RPS']}
        onNavItemClick={handleNavClick}
        onHomeClick={onNavigateHome}
        showRoi={false}
      />

      {/* Section A: Hero Video */}
      <div className="relative h-screen w-full overflow-hidden">
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          {/* Abstract Dark Tech Video */}
          <source src="https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 animate-fade-in">
          <h1 className="text-5xl md:text-8xl font-light tracking-widest uppercase mb-6 text-white mix-blend-overlay opacity-90">
            Future Ready
          </h1>
          <div className="h-[1px] w-32 bg-white/30 mb-8"></div>
          <p className="text-gray-300 tracking-[0.4em] uppercase text-xs md:text-sm font-medium">
            Intelligent Energy Distribution
          </p>
        </div>
      </div>

      {/* Section B: The Vision - Minimalist White */}
      <div className="bg-white text-black py-32 md:py-48 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-7xl font-light leading-tight tracking-tight mb-4">
            Leveraging <span className="font-semibold">future technologies.</span>
          </h2>
          <h2 className="text-4xl md:text-7xl font-light leading-tight tracking-tight text-gray-400 mb-16">
            Revolutionising the industry.
          </h2>
          
          <div className="max-w-2xl mx-auto border-l-2 border-black pl-8 text-left">
            <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-light">
              We integrate military-grade sensors with advanced edge computing to create a seamless, 
              automated energy ecosystem. Experience 100% quantity assurance and zero-loss delivery through
              our proprietary Repos OS.
            </p>
          </div>
        </div>
      </div>

      {/* Section C: Technology Deep Dive - Dark & High Tech */}
      <div className="flex flex-col border-t border-gray-900">
        
        {/* Block 1: IoT Controller */}
        <div className="flex flex-col md:flex-row min-h-[700px]">
          <div className="w-full md:w-1/2 bg-[#0a0a0a] flex flex-col justify-center p-12 md:p-24 order-2 md:order-1 border-r border-gray-900">
            <div className="max-w-lg mx-auto md:mx-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">Core Intelligence</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wide">IoT Controller</h3>
              <p className="text-gray-400 leading-relaxed mb-10 font-light text-lg">
                The central nervous system of the RPS. Our proprietary IoT Controller manages real-time data processing, 
                automated dispensing logic, and cloud synchronization, bridging the gap between physical hardware 
                and digital analytics.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-gray-800 pt-8">
                <div>
                   <h4 className="text-white text-2xl font-light mb-1">0.01<span className="text-sm text-gray-500 ml-1">s</span></h4>
                   <p className="text-xs text-gray-500 uppercase tracking-wider">Latency</p>
                </div>
                <div>
                   <h4 className="text-white text-2xl font-light mb-1">99.9<span className="text-sm text-gray-500 ml-1">%</span></h4>
                   <p className="text-xs text-gray-500 uppercase tracking-wider">Uptime</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[500px] md:h-auto relative order-1 md:order-2 overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop" 
              alt="IoT Chip" 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
          </div>
        </div>

        {/* Block 2: Precision Sensors */}
        <div className="flex flex-col md:flex-row min-h-[700px]">
          <div className="w-full md:w-1/2 h-[500px] md:h-auto relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=2000&auto=format&fit=crop" 
              alt="Precision Sensors" 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out"
            />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
          </div>
          <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-12 md:p-24 border-l border-gray-200">
            <div className="max-w-lg mx-auto md:mx-0">
              <div className="flex items-center gap-3 mb-6">
                 <span className="w-8 h-[1px] bg-black"></span>
                 <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Hardware</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-light text-black mb-8 tracking-wide">Precision Sensors</h3>
              <p className="text-gray-600 leading-relaxed mb-10 font-light text-lg">
                Calibrated to detect the slightest variations in volume, density, and temperature. 
                Our ATEX-certified sensor array continuously monitors tank integrity and environmental conditions to prevent pilferage.
              </p>
              
              <ul className="space-y-4">
                 <li className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">Flow Meter Accuracy</span>
                    <span className="text-sm font-bold text-black">±0.1%</span>
                 </li>
                 <li className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">Safety Rating</span>
                    <span className="text-sm font-bold text-black">IP67</span>
                 </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section D: Manufacturing & Factory - Grayscale Grid */}
      <div className="bg-[#050505] py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6 tracking-wide">State-of-the-Art Manufacturing</h2>
            <div className="h-1 w-20 bg-gray-800"></div>
            <p className="text-gray-500 mt-8 max-w-2xl font-light text-lg">
              Precision engineering meets automated assembly. Our world-class facilities ensure consistency, safety, and durability in every unit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {/* Image 1: Welding / Industrial */}
            <div className="group relative h-96 overflow-hidden cursor-crosshair">
              <img 
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2000&auto=format&fit=crop" 
                alt="Factory Welding" 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-8 left-8 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-2">Chakan Plant</p>
                <p className="text-2xl text-white font-light">Automated Welding</p>
              </div>
            </div>

            {/* Image 2: Assembly / Clean Line */}
            <div className="group relative h-96 overflow-hidden cursor-crosshair lg:mt-12">
              <img 
                src="https://images.unsplash.com/photo-1565514020176-892eb1036e62?q=80&w=2000&auto=format&fit=crop" 
                alt="Assembly Line" 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-8 left-8 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-2">Process Control</p>
                <p className="text-2xl text-white font-light">Quality Assurance</p>
              </div>
            </div>

            {/* Image 3: Robotics / High Tech */}
            <div className="group relative h-96 overflow-hidden cursor-crosshair">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000&auto=format&fit=crop" 
                alt="Robotic Arm" 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-8 left-8 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-2">Innovation Lab</p>
                <p className="text-2xl text-white font-light">R&D & Robotics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section E: CTA */}
      <div className="bg-white py-32 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold text-black mb-10 tracking-tight">Ready to Innovate?</h2>
        <button 
          onClick={onNavigateToApp}
          className="group relative overflow-hidden bg-black text-white px-12 py-5 text-sm font-bold uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105"
        >
          <span className="relative z-10">Build Your Own RPS</span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-gray-800"></div>
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;
