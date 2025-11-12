import React from 'react';

const CheckIcon: React.FC = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);

const CrossIcon: React.FC = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

const FeatureRow: React.FC<{ label: string; standard: boolean; premium: boolean; }> = ({ label, standard, premium }) => (
    <div className="grid grid-cols-3 gap-4 items-center">
        <p className="text-gray-600">{label}</p>
        <div className="flex justify-center">{standard ? <CheckIcon /> : <CrossIcon />}</div>
        <div className="flex justify-center">{premium ? <CheckIcon /> : <CrossIcon />}</div>
    </div>
);

const FeatureSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <div className="grid grid-cols-3 gap-4 items-start col-span-3 mb-2">
            <p className="font-semibold col-span-3">{title}</p>
        </div>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);


const ConnectivityModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative p-6 md:p-8"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800" aria-label="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-semibold mb-6">Connectivity Packages</h2>

        <div className="grid grid-cols-3 gap-4 text-sm border-b pb-3">
          <div className="font-semibold">Features</div>
          <div className="text-center font-semibold">Standard<sup className="text-xs">1</sup></div>
          <div className="text-center font-semibold">Premium<sup className="text-xs">2</sup></div>
        </div>

        <div className="mt-4 space-y-4">
          <FeatureSection title="Navigation">
              <FeatureRow label="Navigation with Real-Time Traffic Along the Route" standard={true} premium={true} />
          </FeatureSection>
          
          <FeatureSection title="AI Companion">
              <FeatureRow label="Grok" standard={false} premium={true} />
          </FeatureSection>

          <FeatureSection title="Maps & Weather">
            <FeatureRow label="Satellite-View Maps" standard={false} premium={true} />
            <FeatureRow label="Weather Forecast and Precipitation Maps" standard={false} premium={true} />
            <FeatureRow label="Speed Cameras" standard={false} premium={true} />
            <FeatureRow label="Live Traffic Maps" standard={false} premium={true} />
          </FeatureSection>
        </div>
      </div>
    </div>
  );
};

export default ConnectivityModal;