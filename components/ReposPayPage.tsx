import React from 'react';
import Header from './Header';

interface ReposPayPageProps {
  onBack: () => void;
  onNavigateToApp: () => void;
  onAboutClick: () => void;
}

const ReposPayPage: React.FC<ReposPayPageProps> = ({ onBack, onNavigateToApp, onAboutClick }) => {
  const benefits = [
    {
      title: "15+7 Days Credit",
      desc: "Enjoy up to 22 days of credit on all diesel purchases.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Zero Hidden Charges",
      desc: "No issuance fees. No transaction fees. No annual renewal charges.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    },
    {
      title: "Easy Reconciliation",
      desc: "Access detailed ledgers and reports of all diesel orders in a few clicks.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <Header 
        navItems={['Home', 'Build Your Own RPS', 'About Us']}
        onHomeClick={onBack}
        onNavItemClick={(item) => {
           if (item === 'Home') onBack();
           if (item === 'Build Your Own RPS') onNavigateToApp();
           if (item === 'About Us') onAboutClick();
        }}
        showRoi={false}
      />

      <div className="relative pt-24 pb-32 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6">Repos Pay</h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">The Diesel Credit Companion.</p>
      </div>

      <div className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
              <div className="mb-6">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="py-24 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Fuel Your Growth with Intelligent Financing</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">Our financial ecosystem is built to ensure you never run out of energy. With Repos Pay, managing fuel procurement is as simple as a tap.</p>
        <button onClick={onNavigateToApp} className="bg-white text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">Apply Now</button>
      </div>
    </div>
  );
};

export default ReposPayPage;