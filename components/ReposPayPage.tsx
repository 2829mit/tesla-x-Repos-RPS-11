
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

  const eligibilityCriteria = [
    "Minimum annual turnover of ₹2 Crore",
    "Registered business (Proprietorship, Private Ltd., or Partnership)",
    "Company must be at least 2 years old",
    "CIBIL score of 750+ for all promoters/directors",
    "No defaults or overdue loans in the past"
  ];

  const docRequirements = [
    {
      type: "Proprietorship",
      docs: [
        "Last 6 months GSTR-3B",
        "Last 6 months main CC/OD bank statement",
        "Audited financials (FY 22-23 & 23-24)",
        "Provisional financials (FY 24-25)",
        "PAN & Aadhaar of proprietor",
        "GST Certificate and Udyam Aadhaar"
      ]
    },
    {
      type: "Private Limited",
      docs: [
        "Last 6 months GSTR-3B",
        "Last 6 months main CC/OD bank statement",
        "Audited financials (FY 22-23 & 23-24)",
        "Provisional financials (FY 24-25)",
        "PAN & Aadhaar of all directors",
        "GST & PAN of company",
        "MOA, AOA, and COI"
      ]
    },
    {
      type: "Partnership",
      docs: [
        "Last 6 months GSTR-3B",
        "Last 6 months main CC/OD bank statement",
        "Audited financials (FY 22-23 & 23-24)",
        "Provisional financials (FY 24-25)",
        "PAN & Aadhaar of all partners",
        "GST & PAN of partnership firm",
        "Partnership Deed"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black">
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

      {/* Hero Section */}
      <div className="relative pt-24 pb-32 px-6 border-b border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="animate-fade-in z-10">
            <span className="text-blue-500 font-bold tracking-widest uppercase text-xs mb-4 block">
              Financing Simplified
            </span>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 leading-tight">
              The Diesel <br/>
              Credit Companion.
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg font-light">
              Fuel your growth with the Repos Pay Card. A dedicated credit instrument designed 
              to make your diesel purchases smarter, faster, and stress-free.
            </p>
            
            <div className="flex gap-4">
               <button 
                onClick={() => window.open('https://reposenergy.com/repospay', '_blank')}
                className="bg-white text-black px-8 py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
               >
                 Apply Now
               </button>
            </div>
          </div>

          {/* Visual: The Card */}
          <div className="relative flex justify-center items-center perspective-1000 animate-fade-in delay-100">
             {/* Glow Effect */}
             <div className="absolute inset-0 bg-blue-600 blur-[120px] opacity-20 rounded-full"></div>
             
             {/* The Card Component */}
             <div className="relative w-full max-w-[420px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-zinc-800 via-black to-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-700 ease-out p-8 flex flex-col justify-between">
                {/* Gloss/Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none"></div>
                
                {/* Card Header */}
                <div className="flex justify-between items-start relative z-10">
                   <div className="flex flex-col">
                      <span className="text-2xl font-bold tracking-tight text-white italic">Repos Pay</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Premium Credit</span>
                   </div>
                   {/* Chip */}
                   <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 border border-yellow-700 shadow-inner flex items-center justify-center relative overflow-hidden">
                       <div className="w-full h-[1px] bg-black/20 absolute top-1/3"></div>
                       <div className="w-full h-[1px] bg-black/20 absolute bottom-1/3"></div>
                       <div className="h-full w-[1px] bg-black/20 absolute left-1/3"></div>
                       <div className="h-full w-[1px] bg-black/20 absolute right-1/3"></div>
                   </div>
                </div>

                {/* Card Number (Masked) */}
                <div className="relative z-10 mt-8">
                   <p className="text-xl md:text-2xl tracking-widest font-mono text-gray-300 group-hover:text-white transition-colors text-center">
                     •••• •••• •••• 8842
                   </p>
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-end relative z-10 mt-auto">
                   <div>
                      <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Card Holder</p>
                      <p className="text-sm font-medium tracking-wide text-gray-200">YOUR BUSINESS NAME</p>
                   </div>
                   <div className="flex flex-col items-end">
                      <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Expires</p>
                      <p className="text-sm font-medium tracking-wide text-gray-200">12/29</p>
                   </div>
                </div>
                
                {/* Decorative Pattern */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-zinc-800 to-transparent opacity-20 rounded-full translate-y-1/2 translate-x-1/2"></div>
             </div>
          </div>

        </div>
      </div>

      {/* NEW SECTION: Financing Simplified */}
      <div className="py-24 px-6 bg-[#050505] border-b border-zinc-900">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
              
              {/* Left Column: Sticky Header */}
              <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                 <h2 className="text-4xl md:text-6xl font-semibold mb-6 leading-tight tracking-tight">
                   Financing <br/> Simplified
                 </h2>
                 <div className="h-1 w-20 bg-blue-600 mb-8"></div>
                 <p className="text-xl text-white font-medium mb-1">Your Fuel.</p>
                 <p className="text-xl text-white-500 font-light">Your choice of payment.</p>
              </div>

              {/* Right Column: Cards Grid */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* Card 1: EMI */}
                 <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all duration-300 flex flex-col justify-between min-h-[400px]">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">EMI Options Available</h3>
                      <p className="text-gray-400 font-light text-sm mb-8">
                        Only the best financing partners for you. Pre-approved loans at competitive rates per annum. Offline financing accepted too. There, we sorted it out for you.
                      </p>
                      {/* Bank Logos / Circles */}
                      <div className="flex gap-3 mb-8">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center text-[10px] font-bold">AXIS</div>
                         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-800 to-blue-500 flex items-center justify-center text-[10px] font-bold">HDFC</div>
                         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-[10px] font-bold">ICICI</div>
                         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 flex items-center justify-center text-[10px] font-bold text-black">SBI</div>
                      </div>
                    </div>
                    <button className="w-full bg-white text-black py-3 rounded font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition-colors">
                      Calculate EMI &rarr;
                    </button>
                 </div>

                 {/* Card 2: Pay By Cash */}
                 <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all duration-300 flex flex-col justify-start min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                       <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Pay by Cash</h3>
                    <p className="text-gray-400 font-light text-sm">
                      Get the Repos Portable Station with our new all-cash / 100% advance payment option for maximum benefits.
                    </p>
                 </div>

                 {/* Card 3: Split and Pay */}
                 <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all duration-300 flex flex-col justify-between row-span-2 min-h-[450px]">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">Now take it slow with Split and Pay</h3>
                      <p className="text-gray-400 font-light text-sm mb-8">
                         Split the amount and pay. You choose the split amount. You choose the payment mode. You call the shots.
                      </p>
                    </div>
                    
                    {/* Visual Mockup for App Slider */}
                    <div className="mt-auto bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                       <div className="flex justify-between text-xs text-gray-400 mb-2">
                          <span>Total Payable</span>
                          <span>₹14,99,000</span>
                       </div>
                       <div className="w-full h-1.5 bg-zinc-700 rounded-full mb-4 relative">
                          <div className="absolute left-0 top-0 h-full w-2/3 bg-blue-500 rounded-full"></div>
                          <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow cursor-pointer hover:scale-110 transition-transform"></div>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <div>
                             <span className="block text-gray-500">Split 1 Payment</span>
                             <span className="text-white font-mono">₹9,99,000</span>
                          </div>
                          <div className="text-right">
                             <span className="block text-gray-500">Balance Amount</span>
                             <span className="text-white font-mono">₹5,00,000</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Card 4: Online Payment */}
                 <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all duration-300 flex flex-col justify-start min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                       <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Online Payment</h3>
                    <p className="text-gray-400 font-light text-sm">
                      Hassle-free online payments with Credit Card, Debit Card, or UPI. Secure and instant.
                    </p>
                 </div>

              </div>
           </div>
        </div>
      </div>

      {/* Section: Benefits Grid (Tesla Style) */}
      <div className="py-24 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold mb-6">Why Choose Repos Pay?</h2>
            <div className="w-20 h-1 bg-blue-600"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((item, idx) => (
              <div key={idx} className="bg-[#111] border border-zinc-800 p-10 rounded-xl hover:border-zinc-600 transition-colors group">
                 <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {item.icon}
                 </div>
                 <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                 <p className="text-gray-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section: Eligibility (Simple List) */}
      <div className="py-24 px-6 bg-zinc-900 border-y border-zinc-800">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-12">Eligibility Criteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
               {eligibilityCriteria.map((criteria, i) => (
                 <div key={i} className="flex items-start gap-4 p-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                       <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-gray-300 font-light">{criteria}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Section: Documents Required */}
      <div className="py-24 px-6">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4 text-center">Required Documentation</h2>
            <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">Prepare these documents based on your business entity type for a seamless application process.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {docRequirements.map((req, idx) => (
                  <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 hover:bg-zinc-900 transition-colors">
                     <h3 className="text-xl font-bold mb-6 text-white border-b border-zinc-800 pb-4">{req.type}</h3>
                     <ul className="space-y-3">
                        {req.docs.map((doc, dIdx) => (
                           <li key={dIdx} className="flex items-start gap-3 text-sm text-gray-400">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                              <span>{doc}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Footer CTA */}
      <div className="py-24 px-6 text-center border-t border-zinc-900">
         <h2 className="text-4xl font-semibold mb-8">Ready to Fuel Your Business?</h2>
         <button 
           onClick={() => window.open('https://reposenergy.com/contact', '_blank')}
           className="bg-blue-600 text-white px-12 py-4 rounded font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
         >
           Contact Us
         </button>
      </div>

    </div>
  );
};

export default ReposPayPage;
