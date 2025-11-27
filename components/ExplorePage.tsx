
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
    // Ensure video plays automatically
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
    { name: "PESO", desc: "Petroleum & Explosives Safety" },
    { name: "LSM", desc: "Legal Metrology Standards" },
    { name: "CIMFR", desc: "Mining & Fuel Research" },
    { name: "BIS", desc: "Bureau of Indian Standards" },
    { name: "ATEX", desc: "Explosive Atmospheres" }
  ];

  // Duplicate the array to create a seamless loop
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
      
      {/* Inline styles for custom animations */}
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

      {/* Section A: Hero Video */}
      <div className="relative h-screen w-full overflow-hidden">
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          {/* Abstract Dark Tech Video */}
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
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-70 animate-bounce">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Section B: The Vision - Minimalist White */}
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

      {/* Section C: Technology Deep Dive - Dark & High Tech */}
      <div className="flex flex-col border-t border-zinc-900">
        
        {/* Block 1: IoT Controller */}
        <div className="flex flex-col md:flex-row min-h-[800px] bg-[#050505]">
          <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 order-2 md:order-1 border-r border-zinc-900 relative">
            <div className="absolute top-0 left-0 p-8 opacity-20">
               <span className="text-9xl font-bold text-outline">01</span>
            </div>
            
            <div className="max-w-lg mx-auto md:mx-0 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">Core Intelligence</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-light text-white mb-8 tracking-tight">IoT Controller</h3>
              <p className="text-gray-400 leading-relaxed mb-12 font-light text-lg">
                The central nervous system of the RPS. Our proprietary IoT Controller manages real-time data processing, 
                automated dispensing logic, and cloud synchronization, bridging the gap between physical hardware 
                and digital analytics.
              </p>
              
              <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                <div className="bg-[#080808] p-6 hover:bg-[#111] transition-colors duration-500">
                   <h4 className="text-white text-3xl font-light mb-2">100k</h4>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest">Offline Transactions</p>
                </div>
                <div className="bg-[#080808] p-6 hover:bg-[#111] transition-colors duration-500">
                   <h4 className="text-white text-3xl font-light mb-2">99.9%</h4>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest">Uptime Reliability</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[500px] md:h-auto relative order-1 md:order-2 overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop" 
              alt="IoT Chip" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Block 2: Intelligent Overfill Prevention - Light Theme Variant */}
        <div className="flex flex-col md:flex-row min-h-[800px] bg-white text-black">
          <div className="w-full md:w-1/2 h-[500px] md:h-auto relative overflow-hidden group border-r border-gray-100">
            <div className="absolute inset-0 bg-gray-50"></div>
            <img 
              src="https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764177695/Gemini_Generated_Image_wnjc9hwnjc9hwnjc_jaoh8q.png" 
              alt="Smart Float Mechanism" 
              className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out mix-blend-multiply"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
               <span className="text-9xl font-bold text-gray-900">02</span>
            </div>

            <div className="max-w-lg mx-auto md:mx-0 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <span className="w-8 h-[1px] bg-black"></span>
                 <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Mechanics</span>
              </div>
              
              <h3 className="text-4xl md:text-6xl font-light text-black mb-6 tracking-tight leading-none">Overfill Prevention</h3>
              
              <p className="text-gray-800 font-medium text-xl mb-10 pl-6 border-l-2 border-black">
                Smart float mechanism prevents tank overfill.
              </p>
              
              {/* Timeline Style Steps */}
              <div className="relative border-l border-gray-200 ml-4 space-y-8 pl-8 py-2">
                  <div className="relative group">
                      <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-300 group-hover:border-black group-hover:scale-125 transition-all duration-300"></div>
                      <h5 className="text-sm font-bold uppercase tracking-wide text-gray-400 group-hover:text-black mb-1 transition-colors">Step 01</h5>
                      <p className="text-gray-800 font-light text-lg">Float rises with fuel level.</p>
                  </div>
                   <div className="relative group">
                      <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-300 group-hover:border-black group-hover:scale-125 transition-all duration-300"></div>
                      <h5 className="text-sm font-bold uppercase tracking-wide text-gray-400 group-hover:text-black mb-1 transition-colors">Step 02</h5>
                      <p className="text-gray-800 font-light text-lg">At 95% capacity, it triggers a switch.</p>
                  </div>
                   <div className="relative group">
                      <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-300 group-hover:border-black group-hover:scale-125 transition-all duration-300"></div>
                      <h5 className="text-sm font-bold uppercase tracking-wide text-gray-400 group-hover:text-black mb-1 transition-colors">Step 03</h5>
                      <p className="text-gray-800 font-light text-lg">Signal sent to Repos IoT Controller.</p>
                  </div>
                   <div className="relative group">
                      <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-black group-hover:scale-125 transition-all duration-300"></div>
                      <h5 className="text-sm font-bold uppercase tracking-wide text-black mb-1 transition-colors">Outcome</h5>
                      <p className="text-black font-semibold text-lg">ReposOS instantly stops the fuel pump.</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Safety & Intelligence Ecosystem (Separated Sections) */}
      <div className="bg-[#050505]">
         <div className="py-32 px-6 text-center bg-black border-b border-zinc-900">
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">Safety Ecosystem</h2>
            <div className="h-[1px] w-24 bg-zinc-800 mx-auto"></div>
            <p className="text-gray-500 mt-6 tracking-widest uppercase text-xs">Engineered for Zero Failure</p>
         </div>

         {/* Features Loop - Zig Zag Layout */}
         {safetyFeatures.map((feature, idx) => (
           <div key={idx} className={`flex flex-col md:flex-row min-h-[600px] border-b border-zinc-900 ${idx % 2 !== 0 ? 'bg-[#0a0a0a]' : 'bg-black'}`}>
             {/* Text Content */}
             <div className={`w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 order-2 relative overflow-hidden ${idx % 2 === 0 ? 'md:order-1 border-r border-zinc-900' : 'md:order-2 border-l border-zinc-900'}`}>
                
                {/* Large Watermark Number */}
                <div className={`absolute top-0 ${idx % 2 === 0 ? 'left-0' : 'right-0'} p-8 opacity-10 pointer-events-none`}>
                  <span className="text-[12rem] font-bold text-outline leading-none">0{idx + 3}</span>
                </div>

                <div className="max-w-md mx-auto md:mx-0 relative z-10">
                  <span className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-6 block border-l-2 border-white pl-3">
                    {feature.subtitle}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-light text-white mb-8 leading-tight tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>
             </div>
             
             {/* Visual */}
             <div className={`w-full md:w-1/2 relative order-1 ${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'} group overflow-hidden`}>
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500"></div>
             </div>
           </div>
         ))}
      </div>

      {/* NEW SECTION: License & Compliance Camera Roll */}
      <div className="bg-white py-32 overflow-hidden border-b border-gray-100">
          <div className="flex flex-col items-center justify-center text-center mb-20 px-6">
              <h2 className="text-3xl md:text-4xl font-light text-black tracking-tight mb-4">Certified Excellence</h2>
              <div className="w-px h-12 bg-black mb-4"></div>
              <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">Compliance & Standards</p>
          </div>
          
          <div className="relative w-full">
              {/* Marquee Container */}
              <div className="flex w-fit animate-marquee hover:pause">
                  {carouselItems.map((item, i) => (
                      <div key={i} className="flex-shrink-0 w-[300px] h-[380px] mx-8 bg-white border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-8 group hover:-translate-y-2 transition-transform duration-500">
                           <div className="w-full h-full border border-gray-100 flex items-center justify-center relative bg-zinc-50 flex-col overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.516L20.297 19H3.703L12 5.516zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/></svg>
                              </div>
                              
                              <div className="text-center relative z-10">
                                <h3 className="text-5xl font-bold text-gray-900 mb-4 tracking-tighter">{item.name}</h3>
                                <div className="h-0.5 w-8 bg-black mx-auto mb-6"></div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white bg-black px-3 py-1 mb-4 inline-block">Approved</span>
                                <p className="text-xs text-gray-500 max-w-[150px] mx-auto leading-relaxed font-medium">{item.desc}</p>
                              </div>
                           </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Section D: Manufacturing & Factory - Grayscale Grid */}
      <div className="bg-[#050505] py-32 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6 tracking-tight">State-of-the-Art Manufacturing</h2>
            <div className="h-1 w-20 bg-zinc-800"></div>
            <p className="text-gray-500 mt-8 max-w-2xl font-light text-lg">
              Precision engineering meets automated assembly. Our world-class facilities ensure consistency, safety, and durability in every unit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {/* Image 1: Welding / Industrial */}
            <div className="group relative h-[500px] overflow-hidden cursor-crosshair">
              <img 
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2000&auto=format&fit=crop" 
                alt="Factory Welding" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-8 left-8 transform translate-y-4 group-hover:translate-y-0 opacity-50 group-hover:opacity-100 transition-all duration-700">
                <div className="h-px w-8 bg-white mb-4"></div>
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Chakan Plant</p>
                <p className="text-3xl text-white font-light">Automated Welding</p>
              </div>
            </div>

            {/* Image 2: Assembly / Clean Line */}
            <div className="group relative h-[500px] overflow-hidden cursor-crosshair lg:mt-16">
              <img 
                src="https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764216794/LargestIoTfactoryintheworldformobilepetrolpumps_dckqcy.webp" 
                alt="Repos Assembly Line" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-8 left-8 transform translate-y-4 group-hover:translate-y-0 opacity-50 group-hover:opacity-100 transition-all duration-700">
                <div className="h-px w-8 bg-white mb-4"></div>
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Process Control</p>
                <p className="text-3xl text-white font-light">Quality Assurance</p>
              </div>
            </div>

            {/* Image 3: Robotics / High Tech */}
            <div className="group relative h-[500px] overflow-hidden cursor-crosshair">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000&auto=format&fit=crop" 
                alt="Robotic Arm" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-8 left-8 transform translate-y-4 group-hover:translate-y-0 opacity-50 group-hover:opacity-100 transition-all duration-700">
                <div className="h-px w-8 bg-white mb-4"></div>
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Innovation Lab</p>
                <p className="text-3xl text-white font-light">R&D & Robotics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Research & Development */}
      <div className="bg-white text-black py-32 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            {/* Text Content */}
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-6 block">
                Government of India Recognized
              </span>
              <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight leading-none">
                Accredited by <br/>
                <span className="font-bold">DSIR</span>
              </h2>
              <div className="h-1 w-20 bg-black mb-10"></div>
              
              <p className="text-xl leading-relaxed font-light text-gray-800 mb-8">
                Repos Research Centre has been accredited by <span className="font-semibold">DSIR</span> for its groundbreaking technological innovations, making us <span className="font-semibold">one out of 2%</span> of private R&D Labs in India.
              </p>
              
              <p className="text-gray-500 leading-relaxed text-sm max-w-md">
                Our R&D facility is certified and approved by the Department of Science & Industrial Research (DSIR), a renowned Government of India (GoI) institution.
              </p>
            </div>

            {/* Visuals */}
            <div className="relative">
               <div className="grid grid-cols-1 gap-8">
                  <div className="bg-gray-50 p-8 border border-gray-100 shadow-xl transform hover:-translate-y-2 transition-transform duration-500">
                     <img 
                       src="https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764218338/Screenshot_2025-11-27_100831_qvnqx7.png" 
                       alt="DSIR Accreditation Graph" 
                       className="w-full h-auto object-contain mix-blend-multiply" 
                     />
                  </div>
                  <div className="bg-gray-50 p-8 border border-gray-100 shadow-xl transform hover:-translate-y-2 transition-transform duration-500 ml-12 -mt-12 z-10 relative">
                      <img 
                       src="https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764218333/Screenshot_2025-11-27_100753_ugnv3q.png" 
                       alt="R&D Recognition" 
                       className="w-full h-auto object-contain mix-blend-multiply" 
                     />
                  </div>
               </div>
               
               {/* Decorative Element behind */}
               <div className="absolute -top-10 -right-10 text-[10rem] font-bold text-gray-50 opacity-50 -z-10 leading-none select-none hidden md:block">
                 R&D
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Section E: CTA */}
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
