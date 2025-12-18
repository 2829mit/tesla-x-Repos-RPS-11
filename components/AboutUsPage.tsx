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

      <div className="relative py-24 px-6 border-b border-gray-100">
         <div className="max-w-7xl mx-auto text-center animate-fade-in">
            <span className="text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
              Our Journey
            </span>
            <h1 className="text-5xl md:text-8xl font-light tracking-tighter text-black mb-8">
              Relentless <span className="font-bold">Pursuit.</span>
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              From a small office in 2017 to a global energy revolution. We are changing how the world accesses energy, one drop at a time.
            </p>
         </div>
      </div>

      <div className="bg-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed mb-12">
                  Repos Energy is a fuel-tech platform that enables businesses to get doorstep diesel delivery through a seamless app-based network. Our mission is to transform energy distribution by bridging the gap between demand and supply with intelligent IoT-enabled solutions.
              </p>
              <div className="h-px w-24 bg-gray-200 mx-auto"></div>
          </div>
      </div>

      <div className="py-32 px-6 bg-white border-t border-gray-100">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {stats.map((stat, idx) => (
                 <div key={idx} className="bg-white p-10 text-center border border-gray-100 shadow-xl rounded-xl transition-transform hover:-translate-y-2">
                    <h3 className="text-5xl md:text-6xl font-bold text-black mb-4">{stat.value}</h3>
                    <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
      
      <div className="py-24 px-6 bg-gray-50 text-center border-t border-gray-200">
         <h2 className="text-3xl font-bold mb-8">Guided by Vision, Driven by Technology</h2>
         <p className="max-w-3xl mx-auto text-gray-600 mb-12">Under the mentorship of industry titans like Mr. Ratan Tata, we have built a legacy of trust and innovation. Our portable stations are the pinnacle of safety and automation.</p>
         <button onClick={onNavigateToApp} className="bg-black text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">Partner with Us</button>
      </div>
    </div>
  );
};

export default AboutUsPage;