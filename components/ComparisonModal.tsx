
import React from 'react';

interface ComparisonModalProps {
  onClose: () => void;
  showPrices: boolean;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ onClose }) => {
  const features = [
    {
      name: "Security & Pilferage",
      traditional: {
        text: "Prone to Thefts & Pilferage",
        sub: "Fuel theft is common during transit and storage.",
        icon: (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      },
      rps: {
        text: "100% Secure System",
        sub: "RFID-enabled dispensing & 24/7 IoT monitoring prevents unauthorized access.",
        icon: (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    },
    {
      name: "Fuel Quality",
      traditional: {
        text: "Risk of Adulteration",
        sub: "High possibility of mixing kerosene or water during transit.",
        icon: (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      rps: {
        text: "Zero Adulteration",
        sub: "Double-walled sealed tanks ensure fuel remains pure.",
        icon: (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      }
    },
    {
      name: "Logistics",
      traditional: {
        text: "Dead Mileage",
        sub: "Fuel wasted in driving assets to petrol pumps and back.",
        icon: (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      rps: {
        text: "Zero Dead Mileage",
        sub: "Doorstep diesel delivery saves time and transit fuel costs.",
        icon: (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      }
    },
    {
      name: "Monitoring & Data",
      traditional: {
        text: "No Reporting",
        sub: "Manual logs (registers) which are prone to human error and manipulation.",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
      rps: {
        text: "Real-time Analytics",
        sub: "ReposOS provides live tracking, consumption logs, and digital reports.",
        icon: (
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
        )
      }
    },
    {
      name: "Inventory Checks",
      traditional: {
        text: "Manual Dipstick Checks",
        sub: "Inaccurate and hazardous manual method.",
        icon: (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      },
      rps: {
        text: "Automated Level Sensors",
        sub: "Precision Fuel Level Sensors provide accurate digital readings.",
        icon: (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      }
    },
    {
      name: "Quality Checks",
      traditional: {
        text: "No Density Checks",
        sub: "Impossible to verify fuel density on-site easily.",
        icon: (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        )
      },
      rps: {
        text: "Auto-Density Monitoring",
        sub: "IoT systems track density to ensure fuel quality.",
        icon: (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    },
    {
      name: "Efficiency",
      traditional: {
        text: "Weather Losses",
        sub: "Fuel levels drop due to temperature changes and evaporation.",
        icon: (
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        )
      },
      rps: {
        text: "Weather Proof",
        sub: "Temperature compensated & fully sealed against elements.",
        icon: (
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex justify-center items-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Why Choose RPS?</h2>
            <p className="text-gray-500 text-sm mt-1">Comparing Traditional Storage vs. Intelligent Automation</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-sm"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8">
          
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-6 mb-4 px-4">
            <div className="col-span-3 text-xs font-bold uppercase tracking-widest text-gray-400">Feature</div>
            <div className="col-span-4 text-xs font-bold uppercase tracking-widest text-red-500">Traditional Fuel Storage</div>
            <div className="col-span-5 text-xs font-bold uppercase tracking-widest text-blue-600">Repos Portable Station</div>
          </div>

          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="group md:grid md:grid-cols-12 md:gap-6 bg-white border border-gray-100 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-200 items-start">
                
                {/* Feature Name */}
                <div className="col-span-3 mb-4 md:mb-0 flex items-center">
                  <span className="font-semibold text-gray-900 text-lg md:text-base">{feature.name}</span>
                </div>

                {/* Traditional Side */}
                <div className="col-span-4 mb-4 md:mb-0 bg-red-50/50 rounded-lg p-3 md:bg-transparent md:p-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 bg-red-100 rounded-full p-1">
                      {feature.traditional.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{feature.traditional.text}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{feature.traditional.sub}</p>
                    </div>
                  </div>
                </div>

                {/* RPS Side */}
                <div className="col-span-5 bg-blue-50/50 rounded-lg p-3 md:bg-transparent md:p-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 bg-blue-100 rounded-full p-1">
                      {feature.rps.icon}
                    </div>
                    <div>
                      <p className="font-bold text-blue-900 text-sm">{feature.rps.text}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{feature.rps.sub}</p>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-4">Switch to Repos Portable Station for 100% Peace of Mind.</p>
          <button 
            onClick={onClose}
            className="bg-black text-white px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
          >
            Start Configuring
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
