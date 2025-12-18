
import React from 'react';
import Header from './Header';

interface AboutUsPageProps {
  onNavigateHome: () => void;
  onNavigateToApp: () => void;
  onExploreClick: () => void;
  onReposPayClick: () => void;
}

const AboutUsPage: React.FC<AboutUsPageProps> = ({ 
  onNavigateHome, 
  onNavigateToApp,
  onExploreClick,
  onReposPayClick
}) => {
  
  const handleNavClick = (item: string) => {
    if (item === 'Build Your Own RPS') onNavigateToApp();
    if (item === 'Home') onNavigateHome();
    if (item === 'Explore') onExploreClick();
    if (item === 'Repos Pay') onReposPayClick();
  };

  const timelineData = [
    {
      year: "2017",
      title: "The Inception",
      events: [
        "Start of Repos Dream – Started in a small office with a vision to change energy distribution.",
        "First Order Completion – Completed 3 Repos Mobile Petrol Pumps (RMPPs) for TATA.",
        "Meeting Mr. Ratan Tata – A pivotal mentorship began.",
        "Foundation of Repos IoT – Laid the groundwork for the world's largest mobile petrol pump facility.",
        "First RMPP Launch – Launched in Varanasi, bringing change to the fuel industry."
      ]
    },
    {
      year: "2019",
      title: "Policy & Recognition",
      events: [
        "Policy Change – GoI introduced Doorstep Diesel Delivery Policy after successful pilots.",
        "TED Talk – Co-founder Aditi Bhosale Walunj shared insights on the diesel industry.",
        "Completing 32 Pilots – Successfully executed government pilot projects.",
        "RMPPs for Indian Army – Deployed specialized units for DGBR and UN.",
        "Repos Towers – Established our innovation HQ in Pune.",
        "Repos IoT Hub – Opened the Chakan facility for groundbreaking R&D."
      ]
    },
    {
      year: "2021",
      title: "Global Stage",
      events: [
        "Energy Startup Summit – Encouraged India's entrepreneurial spirit in fuel.",
        "Patents – Secured 3 national patents and 1 WIPO patent.",
        "National Startup Award – Conferred by Hon. PM Shri Narendra Modi.",
        "VivaTech Paris – Represented India at Europe's largest startup event.",
        "DATUM Launch – Nationwide launch of our diesel data management tool."
      ]
    },
    {
      year: "2023",
      title: "Expansion",
      events: [
        "Select USA Summit – Invited by India and USA embassy to participate in Select USA Investment Summit."
      ]
    }
  ];

  const stats = [
    { label: "Indian Cities", value: "188+" },
    { label: "Mobile Petrol Pumps", value: "2,000+" },
    { label: "Litres of Diesel Sold", value: "4 Cr+" },
    { label: "Partners Acquired", value: "1,000+" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      <Header 
        navItems={['Home', 'Explore', 'Repos Pay', 'Build Your Own RPS']}
        onHomeClick={onNavigateHome}
        onNavItemClick={handleNavClick}
        showRoi={false}
      />

      {/* Hero Section */}
      <div className="relative py-24 px-6 border-b border-gray-100">
         <div className="max-w-7xl mx-auto text-center animate-fade-in">
            <span className="text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
              Our Journey
            </span>
            <h1 className="text-5xl md:text-8xl font-light tracking-tighter text-black mb-8">
              Relentless <span className="font-bold">Pursuit.</span>
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              From a small office to a global energy revolution. We are changing how the world accesses energy, one drop at a time.
            </p>
         </div>
      </div>

      {/* Company Overview Section */}
      <div className="bg-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed">
                  Repos Energy is a fuel-tech platform that enables businesses to get doorstep diesel delivery through a seamless app-based network. We connect <span className="font-medium text-black">2000+ petrol pumps</span> with <span className="font-medium text-black">700+ enterprises</span>, ensuring reliable supply with full transparency. Our IoT-enabled systems guarantee quality, quantity, and secure fuel management for both demand and supply sides.
              </p>
          </div>
      </div>

      {/* Founders Section - Split Layout (Fixes Face Coverage) */}
      <div className="flex flex-col lg:flex-row min-h-[800px]">
         {/* Image Side */}
         <div className="lg:w-1/2 h-[500px] lg:h-auto relative overflow-hidden bg-gray-50">
            <img 
              src="https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764310562/Aditi-Bhosale-Walunj-Chetan-Walunj-scaled-1_ntm0gd.jpg" 
              alt="Chetan and Aditi Walunj" 
              className="absolute inset-0 w-full h-full object-contain object-center"
            />
         </div>
         
         {/* Text Side */}
         <div className="lg:w-1/2 bg-white flex flex-col justify-center p-12 lg:p-24">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-400">Founders</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-10 tracking-tight">Chetan & Aditi</h3>
            
            <div className="space-y-8 text-gray-600 font-light text-lg leading-relaxed">
               <p>
                 <span className="font-semibold text-black border-b border-black pb-0.5">Chetan Walunj</span> began his journey at 21, taking over his family's gas station business. Learning the ropes from the ground up, he saw the inefficiencies that plagued the industry.
               </p>
               <p>
                 <span className="font-semibold text-black border-b border-black pb-0.5">Aditi Bhosale Walunj</span>, with a background in forensics and international relations, brought a unique global perspective and analytical depth.
               </p>
               <p className="text-black italic border-l-4 border-gray-200 pl-6 py-2">
                 "Conceived in 2016, Repos was born from their shared vision to make energy accessible to every corner of the world."
               </p>
               <p>
                 Driven by relentless faith and an indomitable spirit, they believe the world is your oyster if you are relentless in your pursuit.
               </p>
            </div>
         </div>
      </div>

      {/* Timeline Section - Light Theme */}
      <div className="py-32 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
           <h2 className="text-4xl md:text-5xl font-light text-center mb-24 text-black tracking-tight">History of Innovation</h2>
           
           <div className="relative border-l border-gray-300 ml-4 md:ml-1/2 space-y-24">
              {timelineData.map((era, idx) => (
                <div key={idx} className="relative pl-12 md:pl-0">
                   {/* Dot */}
                   <div className="absolute -left-[5px] md:left-1/2 md:-ml-[5px] top-2 w-2.5 h-2.5 bg-blue-600 rounded-full ring-4 ring-blue-100"></div>
                   
                   <div className={`md:flex items-start justify-between ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''} w-full`}>
                      {/* Year Label */}
                      <div className={`md:w-[45%] mb-4 md:mb-0 ${idx % 2 === 0 ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                         <span className="text-6xl font-bold text-gray-200 block leading-none mb-2">{era.year}</span>
                         <span className="text-lg text-black font-semibold tracking-wide uppercase">{era.title}</span>
                      </div>
                      
                      {/* Content Card */}
                      <div className={`md:w-[45%] ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                         <ul className="space-y-6">
                            {era.events.map((event, eIdx) => (
                              <li key={eIdx} className="group flex items-start gap-4">
                                <span className="h-px w-6 bg-gray-300 mt-3 group-hover:bg-black transition-colors"></span>
                                <p className="text-gray-600 font-light leading-relaxed group-hover:text-black transition-colors">
                                  {event}
                                </p>
                              </li>
                            ))}
                         </ul>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Impact Stats - Light Cards */}
      <div className="py-32 px-6 bg-white border-t border-gray-100">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-3xl font-light mb-16 tracking-widest uppercase text-gray-400">Our Presence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {stats.map((stat, idx) => (
                 <div key={idx} className="bg-white p-10 text-center border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group rounded-xl">
                    <h3 className="text-5xl md:text-6xl font-bold text-black mb-4 group-hover:text-blue-600 transition-colors">{stat.value}</h3>
                    <div className="h-1 w-12 bg-gray-100 mx-auto mb-4 group-hover:bg-blue-600 transition-colors"></div>
                    <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* CTA Footer */}
      <div className="py-24 text-center bg-gray-50 border-t border-gray-200">
         <h2 className="text-4xl font-semibold mb-8 text-black tracking-tight">Join the Revolution</h2>
         <button 
           onClick={onNavigateToApp}
           className="bg-black text-white px-12 py-4 rounded-md font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
         >
           Build Your Own RPS
         </button>
      </div>
    </div>
  );
};

export default AboutUsPage;
